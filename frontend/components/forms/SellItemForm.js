"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPostForm } from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Info, MapPin, Scale, DollarSign, Tag, FileText } from "lucide-react";

export default function SellItemForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    estimatedWeight: "",
    location: ""
  });
  
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiGet("/seller/categories");
        // Handle both standard response {data: []} and documented implicit array []
        const cats = Array.isArray(res) ? res : (res.data || []);
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try refreshing.");
      } finally {
        setFetchingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > 6) {
      setError("Maximum 6 images allowed");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user || (user.status !== "active" && user.status !== "approved")) {
      setError("You must be an approved seller to list items.");
      return;
    }

    if (files.length < 4) {
      setError("Please upload at least 4 images of your item.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      files.forEach((file) => data.append("images", file));

      await apiPostForm("/seller/listing", data);
      router.push("/dashboard/seller");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  if(!authLoading && (!user || (user.status !== "active" && user.status !== "approved"))) {
      return (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
            <div className="flex">
                <Info className="h-6 w-6 text-amber-500 mr-3" />
                <div>
                    <h3 className="text-lg font-medium text-amber-800">Account Pending Approval</h3>
                    <p className="mt-2 text-amber-700">
                        Your account is currently under review. You cannot list items until your seller account is approved.
                    </p>
                </div>
            </div>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">List New Item</h1>
            <p className="text-slate-500 mt-2">Fill in the details below to publish your scrap listing to the marketplace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Information */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Listing Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. 500kg Mixed Copper Wire - Grade A"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        />
                         <p className="mt-1 text-xs text-slate-500">Include material type and key characteristics.</p>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                        {fetchingCategories ? (
                            <div className="h-12 w-full bg-slate-100 animate-pulse rounded-lg"></div>
                        ) : (
                            <div className="relative">
                                <Tag className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: Details & Location */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8">
                 <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-indigo-600" />
                    Material Details & Logistics
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            placeholder="Describe condition, purity, origin, and any logistics requirements..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Weight (kg)</label>
                            <div className="relative">
                                <Scale className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="estimatedWeight"
                                    required
                                    min="0"
                                    step="0.1"
                                    placeholder="0.00"
                                    value={formData.estimatedWeight}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                         <div className="col-span-2">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Pickup Address</label>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="Full address for collection..."
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Photos */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-indigo-600" />
                    Item Photos
                </h2>
                <p className="text-sm text-slate-500 mb-6">Upload 4 to 6 clear photos of the material. Different angles recommended.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {imagePreviews.map((src, index) => (
                        <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border border-slate-200">
                            <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {files.length < 6 && (
                        <label className="border-2 border-dashed border-slate-300 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-xs font-semibold text-slate-500">Add Photo</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    )}
                </div>
            </div>

            {/* Actions */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-center">
                    <Info className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 font-medium">{error}</span>
                </div>
            )}

            <div className="flex justify-end gap-4 pt-4 pb-12">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-wait transition-all hover:-translate-y-0.5"
                >
                    {loading ? "Submitting Listing..." : "Submit Listing"}
                </button>
            </div>

        </form>
    </div>
  );
}
