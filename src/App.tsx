/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Scale, JapaneseYen, RotateCcw, Plus, X, Crown, CheckCircle2 } from 'lucide-react';

interface ProductData {
  price: string;
  quantity: string;
}

const INITIAL_STATE: ProductData = { price: '', quantity: '' };

export default function App() {
  const [productA, setProductA] = useState<ProductData>(INITIAL_STATE);
  const [productB, setProductB] = useState<ProductData>(INITIAL_STATE);
  const [productC, setProductC] = useState<ProductData>(INITIAL_STATE);
  const [showProductC, setShowProductC] = useState(false);
  const [unitSize, setUnitSize] = useState<number>(100);

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
    ];
    
    if (showProductC) {
      prices.push({ id: 'C', price: unitPriceC });
    }

    const validPrices = prices.filter(p => p.price !== null) as { id: string, price: number }[];

    if (validPrices.length < 2) return null;

    const minPrice = Math.min(...validPrices.map(p => p.price));
    const winners = validPrices.filter(p => p.price === minPrice);
    
    if (winners.length === validPrices.length) return 'DRAW';
    return winners[0].id;
  }, [unitPriceA, unitPriceB, unitPriceC, showProductC]);

  const handleReset = () => {
    setProductA(INITIAL_STATE);
    setProductB(INITIAL_STATE);
    setProductC(INITIAL_STATE);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            万屋チェッカー
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!showProductC && (
            <button
              onClick={() => setShowProductC(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>商品を追加</span>
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            title="リセット"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl flex-1 flex flex-col p-2 md:p-6 gap-4">
        {/* Unit Selection */}
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">比較単位:</span>
          <div className="flex bg-slate-200 p-1 rounded-xl">
            {[1, 10, 100, 1000].map((size) => (
              <button
                key={size}
                onClick={() => setUnitSize(size)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitSize === size 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {size >= 1000 ? `${size/1000}kg` : `${size}g`}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className={`grid gap-1 md:gap-4 flex-1 items-stretch ${showProductC ? 'grid-cols-3' : 'grid-cols-2 max-w-3xl mx-auto w-full'}`}>
          <ProductColumn 
            label="商品 A" 
            data={productA} 
            setData={setProductA} 
            unitPrice={unitPriceA}
            isWinner={winner === 'A'}
            isTriple={showProductC}
            unitSize={unitSize}
          />
          <ProductColumn 
            label="商品 B" 
            data={productB} 
            setData={setProductB} 
            unitPrice={unitPriceB}
            isWinner={winner === 'B'}
            isTriple={showProductC}
            unitSize={unitSize}
          />
          <AnimatePresence>
            {showProductC && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="relative h-full"
              >
                <button
                  onClick={() => {
                    setShowProductC(false);
                    setProductC(INITIAL_STATE);
                  }}
                  className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <ProductColumn 
                  label="商品 C" 
                  data={productC} 
                  setData={setProductC} 
                  unitPrice={unitPriceC}
                  isWinner={winner === 'C'}
                  isTriple={true}
                  unitSize={unitSize}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Thinking Log */}
      <div className="hidden">
        思考ログ：
        1. アクセシビリティを最優先し、主要な文字サイズを大幅に拡大しました。ヘッダーの「A」「B」「C」は特大サイズ（3rem以上）とし、一目で判別できるようにしました。
        2. 項目ラベル（金額、容量、単価）や単位の文字サイズを上げ、視認性を向上させました。
        3. 入力エリアのパディングを増やし、フォントサイズを大きくすることで、操作ミスを防ぐ「指に優しい」デザインに最適化しました。
        4. 3カラムの横並びレイアウト、apple-touch-icon設定、最安値の黄金演出（王冠と枠線）はすべて維持しています。
      </div>
    </div>
  );
}

interface ProductColumnProps {
  label: string;
  data: ProductData;
  setData: (data: ProductData) => void;
  unitPrice: number | null;
  isWinner: boolean;
  isTriple: boolean;
  unitSize: number;
}

function ProductColumn({ label, data, setData, unitPrice, isWinner, isTriple, unitSize }: ProductColumnProps) {
  // Extract the letter (A, B, or C) from the label
  const letter = label.split(' ')[1] || label;

  return (
    <div className={`relative flex flex-col rounded-2xl transition-all duration-500 border-2 h-full ${
      isWinner 
        ? 'bg-yellow-50 border-yellow-400 shadow-md z-10 ring-1 ring-yellow-400' 
        : 'bg-white border-transparent'
    }`}>
      {/* Winner Label */}
      <div className="h-7 flex items-center justify-center">
        <AnimatePresence>
          {isWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="text-yellow-600 flex flex-col items-center"
            >
              <Crown className="w-5 h-5 fill-yellow-400" />
              <span className="text-[9px] font-black uppercase tracking-tighter">最安値！</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`${isTriple ? 'px-1 md:px-4' : 'px-4 md:px-8'} pb-4 flex flex-col gap-4`}>
        <div className="text-center pt-0 pb-1">
          <span className={`text-5xl md:text-7xl font-black tracking-tighter ${isWinner ? 'text-yellow-700' : 'text-slate-400'}`}>
            {letter}
          </span>
        </div>

        {/* Price Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-xs md:text-sm font-bold text-slate-500 uppercase">
            <JapaneseYen className="w-3 h-3 md:w-4 md:h-4" /> 金額
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value.replace(/[^0-9.]/g, '') })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-2 py-4 md:py-5 text-center font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                isTriple ? 'text-2xl md:text-4xl' : 'text-4xl md:text-6xl'
              }`}
            />
            <span className="absolute right-3 bottom-4 text-xs md:text-sm font-bold text-slate-400">円</span>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-xs md:text-sm font-bold text-slate-500 uppercase">
            <Scale className="w-3 h-3 md:w-4 md:h-4" /> 容量
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={data.quantity}
              onChange={(e) => setData({ ...data, quantity: e.target.value.replace(/[^0-9.]/g, '') })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-2 py-4 md:py-5 text-center font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                isTriple ? 'text-2xl md:text-4xl' : 'text-4xl md:text-6xl'
              }`}
            />
            <span className="absolute right-3 bottom-4 text-xs md:text-sm font-bold text-slate-400">
              {unitSize >= 1000 ? 'kg' : 'g/ml'}
            </span>
          </div>
        </div>

        {/* Unit Price Result */}
        <div className={`mt-2 pt-4 border-t border-slate-100 flex flex-col items-center ${isWinner ? 'border-yellow-200' : ''}`}>
          <span className="text-xs md:text-sm font-bold text-slate-500 mb-1">単価</span>
          <div className="flex items-baseline gap-1">
            <span className={`font-black tracking-tighter ${isWinner ? 'text-yellow-600' : (unitPrice !== null ? 'text-slate-900' : 'text-slate-200')} ${
              isTriple ? 'text-2xl md:text-5xl' : 'text-5xl md:text-8xl'
            }`}>
              {unitPrice !== null ? Math.round(unitPrice).toLocaleString() : '---'}
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-400">円</span>
          </div>
        </div>
      </div>
    </div>
  );
}


