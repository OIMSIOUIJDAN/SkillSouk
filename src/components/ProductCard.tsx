import React from 'react';
import { KnowledgeProduct } from '../types';

interface ProductCardProps {
  product: KnowledgeProduct;
  onBook: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBook }) => {
  // Generate star rating
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const stars = '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));

  const levelColors = {
    Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
    Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const fileTypeIcons: Record<string, string> = {
    PDF: '📄',
    Video: '🎬',
    Audio: '🎧',
    Interactive: '🎮',
  };

  const fileTypeColors: Record<string, string> = {
    PDF: 'text-red-300 bg-red-300/10 border-red-300/30',
    Video: 'text-blue-300 bg-blue-300/10 border-blue-300/30',
    Audio: 'text-purple-300 bg-purple-300/10 border-purple-300/30',
    Interactive: 'text-green-300 bg-green-300/10 border-green-300/30',
  };

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] gold-border group relative">
      {/* Scroll decorative element */}
      <div className="absolute -top-1 -right-1 text-2xl opacity-20 group-hover:opacity-40 transition-opacity rotate-12">
        📜
      </div>

      {/* Header with Merchant */}
      <div className="bg-gradient-to-r from-night-light to-night p-4 flex items-center gap-3 border-b border-white/10">
        <div className="text-3xl">{product.merchantAvatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-cream text-sm truncate">{product.merchantName}</div>
          <div className="text-cream/50 text-xs">Knowledge Merchant</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs border ${levelColors[product.level]}`}>
          {product.level}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* File Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{fileTypeIcons[product.fileType || 'PDF']}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs border ${fileTypeColors[product.fileType || 'PDF']}`}>
            {product.fileType || 'PDF'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-cream text-lg mb-2 group-hover:text-gold transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-cream/60 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-cream/50 text-xs mb-4">
          <span className="flex items-center gap-1">
            <span>⏱️</span>
            {product.duration}
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span>
            {product.reviewCount} reviews
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gold text-sm tracking-wider">{stars}</span>
          <span className="text-cream font-bold text-sm">{product.rating}</span>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <span className="text-gold/30 text-xs">✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl animate-float">🪙</span>
            <span className="text-gold font-bold text-xl">{product.price}</span>
          </div>
          <button
            onClick={onBook}
            className="px-4 md:px-5 py-2 bg-gradient-to-r from-turquoise to-teal-500 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-turquoise/30 text-sm md:text-base active:scale-95"
          >
            {product.fileType === 'PDF' ? '📥 Download' : product.fileType === 'Video' ? '▶️ Watch' : product.fileType === 'Audio' ? '🎧 Listen' : '🎮 Play'}
          </button>
        </div>
      </div>

      {/* Wooden Shelf Effect */}
      <div className="h-2 bg-gradient-to-b from-amber-900/30 to-transparent" />
    </div>
  );
};

export default ProductCard;
