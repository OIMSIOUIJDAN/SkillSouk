import React, { useState, useEffect } from 'react';
import { District, UserState, KnowledgeProduct } from '../types';
import { getProductsByDistrict } from '../data/products';
import GameHUD from './GameHUD';
import ProductCard from './ProductCard';
import MarketplaceStall from './MarketplaceStall';

interface DistrictScreenProps {
  district: District;
  user: UserState;
  onBack: () => void;
  onBookProduct: (product: KnowledgeProduct) => void;
  onUploadProduct: (product: Omit<KnowledgeProduct, 'id' | 'rating' | 'reviewCount'>) => void;
}

const DistrictScreen: React.FC<DistrictScreenProps> = ({
  district,
  user,
  onBack,
  onBookProduct,
  onUploadProduct,
}) => {
  const [visible, setVisible] = useState(false);
  const [localProducts, setLocalProducts] = useState<KnowledgeProduct[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    price: 100,
    duration: '1 hour',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    fileType: 'PDF' as 'PDF' | 'Video' | 'Audio' | 'Interactive',
  });

  useEffect(() => {
    setVisible(true);
    const existingProducts = getProductsByDistrict(district.id);
    setLocalProducts(existingProducts);
  }, [district.id]);

  const handleUpload = () => {
    if (!uploadForm.title.trim()) {
      return;
    }

    const newProduct: KnowledgeProduct = {
      id: `custom-${Date.now()}`,
      districtId: district.id,
      title: uploadForm.title,
      merchantName: user.name,
      merchantAvatar: user.avatar,
      price: uploadForm.price,
      rating: 5.0,
      reviewCount: 0,
      description: uploadForm.description,
      duration: uploadForm.duration,
      level: uploadForm.level,
      fileType: uploadForm.fileType,
    };

    setLocalProducts((prev) => [newProduct, ...prev]);
    onUploadProduct(newProduct);
    setShowUploadForm(false);
    setUploadForm({
      title: '',
      description: '',
      price: 100,
      duration: '1 hour',
      level: 'Beginner',
      fileType: 'PDF',
    });
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Game HUD */}
      <div className="mb-6">
        <GameHUD user={user} compact />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-cream/60 hover:text-gold transition-colors group glass px-4 py-2 rounded-full"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        <span>Back to Souk</span>
      </button>

      {/* District Header with Moroccan Arch */}
      <MarketplaceStall district={district} />

      {/* Role-Based Content */}
      {user.role === 'merchant' ? (
        <div className="space-y-6">
          {/* Merchant Dashboard */}
          <div className="glass rounded-2xl p-6 border border-terracotta/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-terracotta flex items-center gap-2">
                  <span>💰</span> Your Merchant Stall
                </h2>
                <p className="text-cream/60 text-sm mt-1">Share your knowledge and earn coins</p>
              </div>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-6 py-3 bg-gradient-to-r from-terracotta to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>📤</span> Upload Knowledge
              </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-night-light/50 rounded-xl p-4 md:p-6 mb-6 border border-terracotta/20 animate-slide-down">
                <h3 className="font-bold text-cream mb-4 flex items-center gap-2">
                  <span>📜</span> New Knowledge Product
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream/70 text-sm mb-1">Title *</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                      placeholder="e.g., Complete Python Guide"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/70 text-sm mb-1">File Type</label>
                    <select
                      value={uploadForm.fileType}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value as KnowledgeProduct['fileType'] })}
                      className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                    >
                      <option value="PDF">📄 PDF Document</option>
                      <option value="Video">🎬 Video Lecture</option>
                      <option value="Audio">🎧 Audio Course</option>
                      <option value="Interactive">🎮 Interactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cream/70 text-sm mb-1">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream resize-none"
                      rows={2}
                      placeholder="What will learners gain?"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-cream/70 text-sm mb-1">Price (coins)</label>
                      <input
                        type="number"
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) || 0 })}
                        className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                        min={10}
                        max={1000}
                      />
                    </div>
                    <div>
                      <label className="block text-cream/70 text-sm mb-1">Duration</label>
                      <select
                        value={uploadForm.duration}
                        onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                        className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                      >
                        <option value="30 mins">30 mins</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="5 hours">5 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cream/70 text-sm mb-1">Level</label>
                      <select
                        value={uploadForm.level}
                        onChange={(e) => setUploadForm({ ...uploadForm, level: e.target.value as KnowledgeProduct['level'] })}
                        className="w-full glass rounded-lg px-4 py-2 bg-white/5 border border-white/10 focus:border-terracotta focus:outline-none text-cream"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 text-cream/60 hover:text-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadForm.title.trim()}
                    className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                      uploadForm.title.trim()
                        ? 'bg-gradient-to-r from-terracotta to-orange-500 text-white hover:scale-105'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <span>📤</span> Publish Knowledge
                  </button>
                </div>
              </div>
            )}

            {/* Merchant Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-terracotta">{localProducts.filter(p => p.merchantName === user.name).length}</div>
                <div className="text-cream/50 text-xs">Your Products</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-gold">{localProducts.filter(p => p.merchantName === user.name).reduce((sum, p) => sum + p.price, 0)}</div>
                <div className="text-cream/50 text-xs">Potential Earnings</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-turquoise">{localProducts.filter(p => p.merchantName === user.name).reduce((sum, p) => sum + p.reviewCount, 0)}</div>
                <div className="text-cream/50 text-xs">Total Sales</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {localProducts.filter(p => p.merchantName === user.name).length > 0
                    ? (localProducts.filter(p => p.merchantName === user.name).reduce((sum, p) => sum + p.rating, 0) / localProducts.filter(p => p.merchantName === user.name).length).toFixed(1)
                    : '-'}
                </div>
                <div className="text-cream/50 text-xs">Avg Rating</div>
              </div>
            </div>

            {/* Your Products */}
            <h3 className="font-display font-bold text-xl text-cream mb-4 flex items-center gap-2">
              <span>📦</span> Your Knowledge Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProducts
                .filter((p) => p.merchantName === user.name)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBook={() => {}}
                  />
                ))}
              {localProducts.filter((p) => p.merchantName === user.name).length === 0 && (
                <div className="col-span-full glass rounded-xl p-8 text-center border border-white/10">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-cream/60">You haven't uploaded any knowledge yet.</p>
                  <p className="text-cream/40 text-sm mt-2">Click "Upload Knowledge" to share your expertise!</p>
                </div>
              )}
            </div>
          </div>

          {/* Other Merchants */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="font-display font-bold text-xl text-cream mb-4 flex items-center gap-2">
              <span>🏪</span> Other Merchants in {district.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProducts
                .filter((p) => p.merchantName !== user.name)
                .slice(0, 6)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBook={() => onBookProduct(product)}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Learner View */}
          <div className="glass rounded-2xl p-6 border border-turquoise/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-turquoise flex items-center gap-2">
                  <span>📚</span> Knowledge Marketplace
                </h2>
                <p className="text-cream/60 text-sm mt-1">Acquire wisdom from skilled merchants</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cream/50">Your balance:</span>
                <span className="text-2xl animate-float">🪙</span>
                <span className="text-gold font-bold text-xl">{user.coins}</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button className="px-4 py-2 rounded-full bg-turquoise/20 text-turquoise border border-turquoise/30 text-sm whitespace-nowrap">
                All Products
              </button>
              <button className="px-4 py-2 rounded-full glass text-cream/70 hover:text-cream text-sm whitespace-nowrap">
                📄 PDFs
              </button>
              <button className="px-4 py-2 rounded-full glass text-cream/70 hover:text-cream text-sm whitespace-nowrap">
                🎬 Videos
              </button>
              <button className="px-4 py-2 rounded-full glass text-cream/70 hover:text-cream text-sm whitespace-nowrap">
                🎧 Audio
              </button>
              <button className="px-4 py-2 rounded-full glass text-cream/70 hover:text-cream text-sm whitespace-nowrap">
                🎮 Interactive
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProducts.length > 0 ? (
                localProducts.map((product, index) => (
                  <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductCard product={product} onBook={() => onBookProduct(product)} />
                  </div>
                ))
              ) : (
                <div className="col-span-full glass rounded-xl p-8 text-center border border-white/10">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-cream/60">No products available in this district yet.</p>
                  <p className="text-cream/40 text-sm mt-2">Check back soon or explore other districts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictScreen;
