import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, Check } from "lucide-react";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

function ShoppingCartPage({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const [cart, setCart] = useState([]);
  const [articles, setArticles] = useState([
    { id: 1, name: "Water Bottle", price: 2.50, category: "Drinks" },
    { id: 2, name: "Coffee", price: 3.50, category: "Drinks" },
    { id: 3, name: "Snack Bar", price: 1.75, category: "Food" },
    { id: 4, name: "Towel", price: 5.00, category: "Accessories" },
    { id: 5, name: "Shower Gel", price: 8.50, category: "Toiletries" },
    { id: 6, name: "Headphones", price: 15.00, category: "Electronics" },
  ]);
  const [newArticle, setNewArticle] = useState({ name: "", price: "", category: "" });
  const [editingArticle, setEditingArticle] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("shoppingCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }, [cart]);

  // Add article to cart
  const addToCart = (article) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === article.id);
      if (existing) {
        return prev.map(item =>
          item.id === article.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...article, quantity: 1 }];
    });
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add new article
  const handleAddArticle = () => {
    if (!newArticle.name || !newArticle.price) return;
    
    const article = {
      id: Date.now(),
      name: newArticle.name,
      price: parseFloat(newArticle.price),
      category: newArticle.category || "Other"
    };
    
    setArticles(prev => [...prev, article]);
    setNewArticle({ name: "", price: "", category: "" });
  };

  // Edit article
  const handleEditArticle = (article) => {
    if (!editingArticle) {
      setEditingArticle(article);
    } else {
      setArticles(prev =>
        prev.map(a =>
          a.id === editingArticle.id
            ? { ...a, ...editingArticle }
            : a
        )
      );
      setEditingArticle(null);
    }
  };

  // Delete article
  const handleDeleteArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    removeFromCart(id);
  };

  // Checkout
  const handleCheckout = () => {
    // In a real app, you would process payment here
    setCheckoutComplete(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutComplete(false);
    }, 3000);
  };

  // Categories
  const categories = ["Drinks", "Food", "Accessories", "Toiletries", "Electronics", "Other"];

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-black"}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart System</h1>
          <p className="text-slate-500">Book services and add items to cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Articles & Cart */}
          <div className="space-y-6">
            {/* Articles Management */}
            <div className={`rounded-2xl p-6 ${isDark ? "bg-slate-900" : "bg-white"} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Article Management
                </h2>
                <div className="text-sm text-slate-500">{articles.length} articles</div>
              </div>

              {/* Add New Article Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Article name"
                  value={newArticle.name}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border rounded-lg bg-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price €"
                  value={newArticle.price}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, price: e.target.value }))}
                  className="px-3 py-2 border rounded-lg bg-transparent"
                />
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border rounded-lg bg-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddArticle}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium"
              >
                Add Article
              </button>

              {/* Articles List */}
              <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">
                {articles.map(article => (
                  <div key={article.id} className={`p-3 border rounded-lg ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{article.name}</div>
                        <div className="text-sm text-slate-500">{article.category}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">€{article.price.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(article)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
                          >
                            {editingArticle?.id === article.id ? "Save" : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Edit Form */}
                    {editingArticle?.id === article.id && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={editingArticle.name}
                          onChange={(e) => setEditingArticle(prev => ({ ...prev, name: e.target.value }))}
                          className="px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="number"
                          value={editingArticle.price}
                          onChange={(e) => setEditingArticle(prev => ({ ...prev, price: e.target.value }))}
                          className="px-2 py-1 border rounded text-sm"
                        />
                        <select
                          value={editingArticle.category}
                          onChange={(e) => setEditingArticle(prev => ({ ...prev, category: e.target.value }))}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            <div className={`rounded-2xl p-6 ${isDark ? "bg-slate-900" : "bg-white"} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </h2>
                <div className="text-sm text-slate-500">{cart.length} items</div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Your cart is empty
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className={`p-3 border rounded-lg ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-slate-500">€{item.price.toFixed(2)} each</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center border rounded"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center border rounded"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-bold w-20 text-right">
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Checkout & Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className={`rounded-2xl p-6 ${isDark ? "bg-slate-900" : "bg-white"} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Select Booth</label>
                  <select className="w-full px-3 py-2 border rounded-lg bg-transparent">
                    <option>Booth 1 - Single Cabin</option>
                    <option>Booth 2 - Double Cabin</option>
                    <option>Booth 3 - Premium Suite</option>
                    <option>Booth 4 - Family Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Duration</label>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border rounded">-</button>
                    <input
                      type="number"
                      defaultValue={20}
                      className="flex-1 px-3 py-2 border rounded-lg bg-transparent text-center"
                    />
                    <button className="px-3 py-1 border rounded">+</button>
                    <span className="ml-2">minutes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Additional Services</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Extended cleaning (€5.00)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Premium towels (€3.00)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Aromatherapy (€7.00)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout */}
            <div className={`rounded-2xl p-6 ${isDark ? "bg-slate-900" : "bg-white"} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Checkout
              </h2>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {["cash", "card", "paypal", "applepay"].map(method => (
                    <label
                      key={method}
                      className={`p-3 border rounded-lg cursor-pointer flex items-center justify-center gap-2 ${
                        paymentMethod === method
                          ? "border-emerald-500 bg-emerald-500/10"
                          : isDark
                          ? "border-slate-700"
                          : "border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <span className="capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booth 1 (20 min)</span>
                    <span>€15.00</span>
                  </div>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-slate-500">{item.name} x{item.quantity}</span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>€{(15 + total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkoutComplete}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
                  checkoutComplete
                    ? "bg-emerald-600"
                    : "bg-emerald-600 hover:bg-emerald-500"
                } disabled:opacity-50`}
              >
                {checkoutComplete ? (
                  <>
                    <Check className="w-5 h-5" />
                    Payment Successful!
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Complete Purchase - €{(15 + total).toFixed(2)}
                  </>
                )}
              </button>

              {checkoutComplete && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500 rounded-lg text-center">
                  <p className="font-medium">Order completed successfully!</p>
                  <p className="text-sm text-slate-500">Receipt has been sent to the printer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartPage;