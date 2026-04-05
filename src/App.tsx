/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, ShoppingCart, Scale, JapaneseYen, RotateCcw, Info } from 'lucide-react';

interface ProductData {
  price: string;
  quantity: string;
}

const INITIAL_STATE: ProductData = { price: '', quantity: '' };

export default function App() {
  const [productA, setProductA] = useState<ProductData>(INITIAL_STATE);
  const [productB, setProductB] = useState<ProductData>(INITIAL_STATE);
  const [productC, setProductC] = useState<ProductData>(INITIAL_STATE);
  const [unitSize, setUnitSize] = useState<number>(100); // 100g, 100ml, etc.

  const calcUnitPrice = (data: ProductData) => {
    const p = parseFloat(data.price);
    const q = parseFloat(data.quantity);
    if (isNaN(p) || isNaN(q) || q <= 0) return null;
    return (p / q) * unitSize;
  };

  const unitPriceA = useMemo(() => calcUnitPrice(productA), [productA, unitSize]);
  const unitPriceB = useMemo(() => calcUnitPrice(productB), [productB, unitSize]);
  const unitPriceC = useMemo(() => calcUnitPrice(productC), [productC, unitSize]);

  const winner = useMemo(() => {
    const prices = [
      { id: 'A', price: unitPriceA },
      { id: 'B', price: unitPriceB },
      { id: 'C', price: unitPriceC },
    ].filter(p => p.price !== null) as { id: string, price: number }[];

    if (prices.length < 2) return null;

    const minPrice = Math.min(...prices.map(p => p.price));
    const winners = prices.filter(p => p.price === minPrice);
    
    if (winners.length === prices.length) return 'DRAW';
    return winners[0].id;
  }, [unitPriceA, unitPriceB, unitPriceC]);

  const handleReset = () => {
    setProductA(INITIAL_STATE);
    setProductB(INITIAL_STATE);
    setProductC(INITIAL_STATE);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start p-2 md:p-8 bg-slate-950 overflow-x-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop")',
          filter: 'sepia(0.3) brightness(0.5)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mb-6 md:mb-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-yellow-500/50 hidden md:block" />
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              万屋チェッカー
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-500/50 hidden md:block" />
          </div>
          <p className="text-yellow-500/80 text-[10px] md:text-sm font-black uppercase tracking-[0.3em] font-serif">
            Yorozuya Checker - 三つ巴の戦い
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 items-stretch px-2">
        {/* Product A */}
        <ProductCard 
          title="壱" 
          data={productA} 
          setData={setProductA} 
          unitPrice={unitPriceA}
          isWinner={winner === 'A'}
          unitSize={unitSize}
          accentColor="blue"
        />

        {/* Product B */}
        <ProductCard 
          title="弐" 
          data={productB} 
          setData={setProductB} 
          unitPrice={unitPriceB}
          isWinner={winner === 'B'}
          unitSize={unitSize}
          accentColor="rose"
        />

        {/* Product C */}
        <ProductCard 
          title="参" 
          data={productC} 
          setData={setProductC} 
          unitPrice={unitPriceC}
          isWinner={winner === 'C'}
          unitSize={unitSize}
          accentColor="emerald"
        />
      </main>

      {/* Unit Settings & Reset */}
      <footer className="relative z-10 w-full max-w-4xl mt-8 md:mt-12 flex flex-col items-center gap-8">
        <div className="glass px-6 py-4 rounded-full flex items-center gap-6 flex-wrap justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border-white/5">
          <div className="flex items-center gap-2 text-white/60">
            <Info className="w-4 h-4" />
            <span className="text-xs font-black tracking-widest">比較単位</span>
          </div>
          <div className="flex gap-2">
            {[1, 10, 100, 1000].map((size) => (
              <button
                key={size}
                onClick={() => setUnitSize(size)}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${
                  unitSize === size 
                    ? 'bg-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-110' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {size >= 1000 ? `${size/1000}kg` : `${size}g/ml`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-3 px-12 py-4 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all duration-500 border border-white/5 backdrop-blur-xl group"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-700" />
          <span className="text-sm font-black tracking-[0.4em] ml-1">初期化</span>
        </button>
      </footer>

      {/* Thinking Log */}
      <div className="hidden">
        思考ログ：
        1. アプリ名を「万屋チェッカー」に変更し、和風モダンな「Noto Serif JP」を採用。
        2. 商品C（参）を追加し、3分割のグリッドレイアウトを実装。
        3. 勝利判定を3者間で行い、最も安い商品に黄金の「桜の紋（Flowerアイコン）」を表示。
        4. 背景に和の雰囲気を感じる画像とセピア調のフィルタを適用し、世界観を統一。
      </div>
    </div>
  );
}

interface ProductCardProps {
  title: string;
  data: ProductData;
  setData: (data: ProductData) => void;
  unitPrice: number | null;
  isWinner: boolean;
  unitSize: number;
  accentColor: 'blue' | 'rose' | 'emerald';
}

function ProductCard({ title, data, setData, unitPrice, isWinner, unitSize, accentColor }: ProductCardProps) {
  const colors = {
    blue: 'text-blue-400',
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
  };

  return (
    <motion.div 
      layout
      className={`relative p-5 md:p-8 rounded-[2.5rem] flex flex-col gap-6 md:gap-8 transition-all duration-700 border ${
        isWinner 
          ? 'bg-white/15 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.2)] scale-[1.03] z-10' 
          : 'glass border-white/5 opacity-60'
      }`}
    >
      <AnimatePresence>
        {isWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-950 px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.3)] whitespace-nowrap"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
              </svg>
            </div>
            <span className="text-sm tracking-widest">最安の逸品</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Product</span>
          <h2 className={`text-3xl font-serif font-black italic ${colors[accentColor]}`}>{title}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center rotate-3 ${isWinner ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
          <Scale className={`w-6 h-6 ${isWinner ? 'text-yellow-500' : 'text-white/20'}`} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 ml-1 flex items-center gap-2 uppercase tracking-widest">
            <JapaneseYen className="w-3 h-3" /> 金額 (円)
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value.replace(/[^0-9.]/g, '') })}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-3xl font-black text-white placeholder:text-white/5 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 ml-1 flex items-center gap-2 uppercase tracking-widest">
            <Scale className="w-3 h-3" /> 容量 (g/ml)
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={data.quantity}
            onChange={(e) => setData({ ...data, quantity: e.target.value.replace(/[^0-9.]/g, '') })}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-3xl font-black text-white placeholder:text-white/5 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all"
          />
        </div>
      </div>

      <div className={`mt-4 pt-8 border-t border-white/5 flex flex-col items-center transition-colors ${isWinner ? 'border-yellow-500/20' : ''}`}>
        <span className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-[0.2em]">
          単価 / {unitSize >= 1000 ? `${unitSize/1000}kg` : `${unitSize}g`}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-black tracking-tighter ${isWinner ? 'text-yellow-500' : (unitPrice !== null ? 'text-white' : 'text-white/5')}`}>
            {unitPrice !== null ? Math.round(unitPrice).toLocaleString() : '---'}
          </span>
          <span className="text-lg font-bold text-white/20">円</span>
        </div>
      </div>
    </motion.div>
  );
}
