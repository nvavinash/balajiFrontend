import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit, Package } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Topwear');
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [images, setImages] = useState([null, null, null, null]);

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('admin_token');

    const fetchProducts = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));

            images.forEach((image, index) => {
                if (image) formData.append(`image${index + 1}`, image);
            });

            const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                setName('');
                setDescription('');
                setPrice('');
                setImages([null, null, null, null]);
                setSizes([]);
                setShowAddModal(false);
                fetchProducts();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const removeProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchProducts();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleSize = (size) => {
        setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]);
    };

    return (
        <div className="pt-10 pb-20">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="text-gray-400" /> Product Management
                </h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            {/* Product List Table */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center">No products found.</td></tr>
                        ) : products.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <img
                                        src={item.image[0]}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                                        alt=""
                                        className="w-12 h-12 object-cover rounded border"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.subCategory}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{item.category}</td>
                                <td className="px-6 py-4 font-bold">Rs. {item.price}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-3">
                                        <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                                        <button onClick={() => removeProduct(item._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal (Simple Backdrop + Form) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative my-8">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            ✕
                        </button>
                        <h4 className="text-xl font-bold mb-6">Create New Product</h4>

                        <form onSubmit={onSubmitHandler} className="space-y-6">
                            {/* Image Upload Area */}
                            <div className="flex gap-2 mb-4">
                                {images.map((_, i) => (
                                    <label key={i} className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-black transition-colors overflow-hidden">
                                        {images[i] ? (
                                            <img src={URL.createObjectURL(images[i])} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <Plus className="text-gray-300" />
                                        )}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => {
                                                const newImages = [...images];
                                                newImages[i] = e.target.files[0];
                                                setImages(newImages);
                                            }}
                                        />
                                    </label>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="col-span-2">
                                    <label className="block text-gray-700 font-bold mb-1">Product Name</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" type="text" placeholder="Type here" required />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-700 font-bold mb-1">Product Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded h-24" placeholder="Write content here" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-1">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded">
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-1">Subcategory</label>
                                    <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full border p-2 rounded">
                                        <option value="Topwear">Topwear</option>
                                        <option value="Bottomwear">Bottomwear</option>
                                        <option value="Winterwear">Winterwear</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-1">Price</label>
                                    <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded" type="number" placeholder="25" required />
                                </div>
                            </div>

                            <div className="text-sm">
                                <label className="block text-gray-700 font-bold mb-2">Product Sizes</label>
                                <div className="flex gap-3">
                                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <div
                                            key={size}
                                            className={`${sizes.includes(size) ? 'bg-black text-white' : 'bg-gray-100'} px-3 py-1 cursor-pointer border rounded`}
                                            onClick={() => toggleSize(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <input type="checkbox" id='bestseller' checked={bestseller} onChange={() => setBestseller(!bestseller)} />
                                <label htmlFor="bestseller" className="cursor-pointer">Add to bestseller</label>
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                                ADD PRODUCT
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
