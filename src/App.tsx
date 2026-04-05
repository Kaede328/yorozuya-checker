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
          />
          <ProductColumn 
            label="商品 B" 
            data={productB} 
            setData={setProductB} 
            unitPrice={unitPriceB}
            isWinner={winner === 'B'}
            isTriple={showProductC}
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
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Thinking Log */}
      <div className="hidden">
        思考ログ：
        1. 動的なレイアウト切り替え機能を実装。初期状態は2カラム、ボタン操作で3カラムへ拡張可能に。
        2. 商品Cの削除（×ボタン）により、柔軟に比較対象を調整できるようにしました。
        3. 3カラム時でもモバイル画面で文字が重ならないよう、パディングやフォントサイズを微調整。
        4. 最安値判定ロジックを動的に変更し、表示されている商品間でのみ比較を行うように最適化。
        5. 勝利演出として「黄金の王冠」アイコンを採用し、視覚的なフィードバックを強化。
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
}

function ProductColumn({ label, data, setData, unitPrice, isWinner, isTriple }: ProductColumnProps) {
  return (
    <div className={`relative flex flex-col rounded-2xl transition-all duration-500 border-2 h-full ${
      isWinner 
        ? 'bg-yellow-50 border-yellow-400 shadow-md z-10' 
        : 'bg-white border-transparent'
    }`}>
      {/* Winner Label */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence>
          {isWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-yellow-600 flex flex-col items-center"
            >
              <Crown className="w-5 h-5 fill-yellow-400" />
              <span className="text-[8px] font-black uppercase tracking-tighter">最安値！</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`${isTriple ? 'px-1 md:px-4' : 'px-4 md:px-8'} pb-4 flex flex-col gap-4`}>
        <div className="text-center py-1">
          <span className={`text-[10px] md:text-xs font-black tracking-tighter ${isWinner ? 'text-yellow-700' : 'text-slate-400'}`}>
            {label}
          </span>
        </div>

        {/* Price Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-0.5 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
            <JapaneseYen className="w-2 h-2 md:w-3 md:h-3" /> 金額
          </div>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value.replace(/[^0-9.]/g, '') })}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-1 py-3 text-center font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
              isTriple ? 'text-lg md:text-2xl' : 'text-2xl md:text-4xl'
            }`}
          />
        </div>

        {/* Quantity Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-0.5 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
            <Scale className="w-2 h-2 md:w-3 md:h-3" /> 容量
          </div>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={data.quantity}
            onChange={(e) => setData({ ...data, quantity: e.target.value.replace(/[^0-9.]/g, '') })}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-1 py-3 text-center font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
              isTriple ? 'text-lg md:text-2xl' : 'text-2xl md:text-4xl'
            }`}
          />
        </div>

        {/* Unit Price Result */}
        <div className={`mt-2 pt-4 border-t border-slate-100 flex flex-col items-center ${isWinner ? 'border-yellow-200' : ''}`}>
          <span className="text-[8px] md:text-[10px] font-bold text-slate-400 mb-1">単価</span>
          <div className="flex items-baseline gap-0.5">
            <span className={`font-black tracking-tighter ${isWinner ? 'text-yellow-600' : (unitPrice !== null ? 'text-slate-900' : 'text-slate-200')} ${
              isTriple ? 'text-xl md:text-4xl' : 'text-3xl md:text-6xl'
            }`}>
              {unitPrice !== null ? Math.round(unitPrice).toLocaleString() : '---'}
            </span>
            <span className="text-[8px] md:text-xs font-bold text-slate-400">円</span>
          </div>
        </div>
      </div>
    </div>
  );
}


