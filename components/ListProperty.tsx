
import React, { useState } from 'react';
import { User, House } from '../types';
import { supabase } from '../supabaseClient';
import { analyzeHouseImage, getTopLabel, HFAnalysisResult } from '../huggingFaceService';

interface ListPropertyProps {
    user: User;
    onSuccess: () => void;
    onBack: () => void;
}

const ListProperty: React.FC<ListPropertyProps> = ({ user, onSuccess, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [analyzingStates, setAnalyzingStates] = useState<boolean[]>(Array(5).fill(false));
    const [analysisResults, setAnalysisResults] = useState<HFAnalysisResult[][]>(Array(5).fill([]));
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(Array(5).fill(null));
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        district: '',
        state: '',
        type: 'Apartment',
        bhkType: '2BHK',
        image: '',
        description: '',
        amenities: [] as string[]
    });

    const amenitiesList = [
        'Neural Ethernet', 'Climate Control', 'Neural Security', 'Solar Grid', 
        'Smart Storage', 'Air Purification', 'Gym Access', 'Pool','Parking'
    ];

    const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreviews(prev => {
            const next = [...prev];
            next[index] = previewUrl;
            return next;
        });

        // Update primary image if it's the first one
        if (index === 0) {
            setFormData(prev => ({ ...prev, image: previewUrl }));
        }

        // Begin Neural Analysis for this specific slot
        setAnalyzingStates(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
        });

        try {
            const results = await analyzeHouseImage(file);
            setAnalysisResults(prev => {
                const next = [...prev];
                next[index] = results;
                return next;
            });
            
            // Auto-tagging based on primary analysis
            if (index === 0) {
                const topLabel = getTopLabel(results).toLowerCase();
                if (topLabel.includes('house') || topLabel.includes('home')) {
                    setFormData(prev => ({ ...prev, type: 'Individual House' }));
                } else if (topLabel.includes('building') || topLabel.includes('apartment')) {
                    setFormData(prev => ({ ...prev, type: 'Apartment' }));
                }
            }
        } catch (err) {
            console.error(`Neural analysis failed for box ${index}:`, err);
        } finally {
            setAnalyzingStates(prev => {
                const next = [...prev];
                next[index] = false;
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload ALL images from the 5 slots
            const uploadedUrls: string[] = [];
            
            for (let i = 0; i < imagePreviews.length; i++) {
                const previewUrl = imagePreviews[i];
                if (previewUrl && previewUrl.startsWith('blob:')) {
                    try {
                        const response = await fetch(previewUrl);
                        const blob = await response.blob();
                        const fileName = `${Date.now()}-${user.id}-${i}.jpg`;

                        const { error: storageError } = await supabase.storage
                            .from('property-images')
                            .upload(`${user.id}/${fileName}`, blob, {
                                contentType: 'image/jpeg',
                                upsert: true
                            });

                        if (!storageError) {
                            const { data: { publicUrl } } = supabase.storage
                                .from('property-images')
                                .getPublicUrl(`${user.id}/${fileName}`);
                            uploadedUrls.push(publicUrl);
                        }
                    } catch (err) {
                        console.error(`Neural upload failed for slot ${i}:`, err);
                    }
                } else if (previewUrl) {
                    uploadedUrls.push(previewUrl);
                }
            }

            // Set the first image as the primary cover
            const primaryImageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : formData.image;

            // 2. Insert into Database with the full images array
            const { error: dbError } = await supabase
                .from('houses')
                .insert([{
                    title: formData.title,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    district: formData.district,
                    state: formData.state,
                    type: formData.type,
                    bhkType: formData.bhkType,
                    image: primaryImageUrl,
                    images: uploadedUrls, // Save all 5 neural captures
                    description: formData.description,
                    owner_id: user.id,
                    owner_name: user.name,
                    email: user.email,
                    is_approved: false,
                    amenities: formData.amenities,
                    historical_prices: [
                        { year: 2026, price: parseFloat(formData.price) }
                    ]
                }]);

            if (dbError) throw dbError;
            onSuccess();
        } catch (err: any) {
            console.error("Neural submission failed:", err);
            const errorMessage = err?.message || "Protocol Violation: Neural submission could not be verified.";
            alert(`SUBMISSION FAILED:\n${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={onBack}
                        className="group flex items-center gap-3 text-gray-400 hover:text-[#00AEEF] transition-all font-black text-[10px] uppercase tracking-[0.4em]"
                    >
                        <div className="p-2 rounded-xl bg-white border border-black/5 group-hover:border-[#00AEEF]/20 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </div>
                        Back to Search
                    </button>
                    <h1 className="text-5xl font-black text-[#0F172A] mt-8 uppercase tracking-tighter">Submit <span className="text-[#00AEEF]">Intelligence.</span></h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[40px] p-10 md:p-14 space-y-12 shadow-2xl">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Manifestation Title</label>
                    <input
                        required
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                        placeholder="e.g. Skyline Sanctuary"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Type of Living</label>
                        <select
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all cursor-pointer uppercase tracking-widest shadow-sm"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Individual House">Individual House</option>
                            <option value="Studio">Studio</option>
                            <option value="Pg">Pg / Shared</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">BHK Magnitude</label>
                        <select
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all cursor-pointer uppercase tracking-widest shadow-sm"
                            value={formData.bhkType}
                            onChange={e => setFormData({ ...formData, bhkType: e.target.value })}
                        >
                            <option value="1BHK">1 BHK</option>
                            <option value="2BHK">2 BHK</option>
                            <option value="3BHK">3 BHK</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Monthly Cost (Fixed)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. 15000"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Property Location</label>
                        <input
                            required
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. Adyar, Chennai"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">
                            Neural Visual Stack (5 Points of Capture)
                        </label>
                        <span className="text-[10px] font-black text-[#00AEEF] uppercase tracking-widest bg-[#00AEEF]/5 px-4 py-2 rounded-full border border-[#00AEEF]/10">
                            Status: Integrated Analysis Active
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {[0, 1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(idx, e)}
                                        className="hidden"
                                        id={`image-upload-${idx}`}
                                    />
                                    <label
                                        htmlFor={`image-upload-${idx}`}
                                        className={`flex flex-col items-center justify-center w-full h-[180px] border-2 border-dashed rounded-[28px] cursor-pointer transition-all duration-300 ${
                                            imagePreviews[idx] 
                                                ? 'border-[#00AEEF]/30 bg-white shadow-lg' 
                                                : 'border-black/5 bg-gray-50/50 hover:bg-gray-100 hover:border-[#00AEEF]/20'
                                        }`}
                                    >
                                        {imagePreviews[idx] ? (
                                            <div className="relative w-full h-full p-2">
                                                <img 
                                                    src={imagePreviews[idx]!} 
                                                    alt={`Preview ${idx + 1}`} 
                                                    className="w-full h-full object-cover rounded-[20px]"
                                                />
                                                {analyzingStates[idx] && (
                                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[20px] flex items-center justify-center">
                                                        <div className="w-8 h-8 border-4 border-[#00AEEF] border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px] flex items-center justify-center">
                                                    <p className="text-white text-[8px] font-black uppercase tracking-widest">Update Slot {idx + 1}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <div className="p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </div>
                                                <p className="text-[7px] font-black uppercase tracking-[0.2em]">{idx === 0 ? 'Primary' : `Slot ${idx + 1}`}</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* Slot Feedback */}
                                {imagePreviews[idx] && !analyzingStates[idx] && analysisResults[idx].length > 0 ? (
                                    <div className="px-2">
                                        <p className="text-[8px] font-black text-[#00AEEF] uppercase tracking-tighter truncate">
                                            {getTopLabel(analysisResults[idx])}
                                        </p>
                                        <div className="w-full bg-gray-100 h-1 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className="bg-[#00AEEF] h-full" 
                                                style={{ width: `${analysisResults[idx][0].score * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : imagePreviews[idx] && analyzingStates[idx] ? (
                                    <p className="text-[7px] font-black text-amber-500 uppercase tracking-widest animate-pulse px-2 text-center">Scanning...</p>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    <input
                        type="hidden"
                        value={formData.image}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Target District</label>
                        <input
                            required
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. Chennai"
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Governance State</label>
                        <input
                            required
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. Tamil Nadu"
                            value={formData.state}
                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Holding Analysis</label>
                    <textarea
                        required
                        rows={5}
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-[32px] px-8 py-6 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all resize-none placeholder:text-gray-300 uppercase tracking-[0.2em] leading-relaxed shadow-sm"
                        placeholder="Define the premium parameters of your property holding..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-8">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Integrated Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {amenitiesList.map(amenity => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                    formData.amenities.includes(amenity)
                                        ? 'bg-[#00AEEF] border-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20'
                                        : 'bg-white border-black/5 text-gray-400 hover:border-[#00AEEF]/20'
                                }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white font-black py-7 rounded-[28px] shadow-xl shadow-[#00AEEF]/10 disabled:opacity-50 hover:shadow-[#00AEEF]/30 hover:scale-[1.02] transition-all uppercase tracking-[0.4em] text-[11px] active:scale-95"
                >
                    <span className="relative z-10">{loading ? 'Processing Neural Submission...' : 'Initiate Intelligence Verification'}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
            </form>
        </div>
    );
};

export default ListProperty;
