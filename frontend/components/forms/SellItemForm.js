"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPostForm } from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function SellItemForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
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
    
    // Check max files
    if (selectedFiles.length + files.length > 6) {
      setError("Maximum 6 images allowed");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);

    // Create previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Revoke URL to avoid memory leaks
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
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("estimatedWeight", formData.estimatedWeight);
      data.append("location", formData.location);

      files.forEach((file) => {
        data.append("images", file);
      });

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
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        Your account is currently pending approval. You cannot list items yet.
                    </p>
                </div>
            </div>
          </div>
      )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-6 shadow rounded-lg">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Item Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Provide accurate information about the waste/scrap you are selling.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Describe the condition, source, and exact nature of the material."
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="estimatedWeight" className="block text-sm font-medium text-gray-700">
                Estimated Weight (kg)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="estimatedWeight"
                  id="estimatedWeight"
                  required
                  min="0"
                  step="0.1"
                  value={formData.estimatedWeight}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
             <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Pickup Location
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="123 Main St, City, Zip"
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Photos (Min 4, Max 6)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload files</span>
                      <input id="file-upload" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
                {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                        <img src={src} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-md" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Listing"}
          </button>
        </div>
      </div>
    </form>
  );
}
