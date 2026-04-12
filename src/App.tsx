/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect, KeyboardEvent, MutableRefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Scale, JapaneseYen, RotateCcw, Plus, X, Crown } from 'lucide-react';

interface ProductData {
  price: string;
  quantity: string;
  count: string;
}

const INITIAL_STATE: ProductData = { price: '', quantity: '', count: '' };

export default function App() {
  // 商品データを配列で管理（localStorageから復元）
  const [products, setProducts] = useState<ProductData[]>(() => {
    const saved = localStorage.getItem('yorozuya_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 既存データに count がない場合のマイグレーション
      return parsed.map((p: any) => ({
        ...INITIAL_STATE,
        ...p,
        count: p.count !== undefined ? p.count : ''
      }));
    }
    return [
      { ...INITIAL_STATE },
      { ...INITIAL_STATE },
      { ...INITIAL_STATE }
    ];
  });
  const [visibleCount, setVisibleCount] = useState<number>(() => {
    const saved = localStorage.getItem('yorozuya_visibleCount');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [unitSize, setUnitSize] = useState<number>(() => {
    const saved = localStorage.getItem('yorozuya_unitSize');
    return saved ? parseInt(saved, 10) : 100;
  });

  // 自動保存ロジック
  useEffect(() => {
    localStorage.setItem('yorozuya_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('yorozuya_visibleCount', visibleCount.toString());
  }, [visibleCount]);

  useEffect(() => {
    localStorage.setItem('yorozuya_unitSize', unitSize.toString());
  }, [unitSize]);

  // 入力要素の参照を管理
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const calcUnitPrice = (data: ProductData) => {
    const p = parseFloat(data.price);
    const q = parseFloat(data.quantity);
    const c = parseFloat(data.count) || 1;
    
    if (isNaN(p) || c <= 0) return null;
    
    // 容量が空、または0の場合：1個あたりの単価
    if (isNaN(q) || q <= 0) {
      return p / c;
    }
    
    // 容量がある場合：指定単位あたりの単価
    return (p / (q * c)) * unitSize;
  };

  const unitPrices = useMemo(() => 
    products.map(p => calcUnitPrice(p)), 
    [products, unitSize]
  );

  const winner = useMemo(() => {
    const validPrices = unitPrices
      .map((price, index) => ({ id: String.fromCharCode(65 + index), price, index }))
      .filter(p => p.index < visibleCount && p.price !== null) as { id: string, price: number, index: number }[];

    if (validPrices.length < 2) return null;

    const minPrice = Math.min(...validPrices.map(p => p.price));
    const winners = validPrices.filter(p => p.price === minPrice);
    
    if (winners.length === validPrices.length) return 'DRAW';
    return winners[0].id;
  }, [unitPrices, visibleCount]);

  const handleReset = () => {
    setProducts(products.map(() => ({ ...INITIAL_STATE })));
    localStorage.removeItem('yorozuya_products');
  };

  const updateProduct = (index: number, newData: ProductData) => {
    const newProducts = [...products];
    newProducts[index] = newData;
    setProducts(newProducts);
  };

  // オートフォーカス遷移ロジック
  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const lastIndex = (visibleCount * 3) - 1;
      
      if (currentIndex >= lastIndex) {
        // 最後の項目の場合はキーボードを閉じる
        (e.target as HTMLInputElement).blur();
      } else {
        // 次の入力欄へ移動
        const nextIndex = currentIndex + 1;
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex]?.focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-2 px-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            万屋チェッカー
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {visibleCount < 3 && (
            <button
              onClick={() => setVisibleCount(3)}
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

      <main className="w-full max-w-5xl flex-1 flex flex-col p-1 md:p-4 gap-2">
        {/* Unit Selection */}
        <div className="flex items-center justify-center gap-2 py-1">
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
        <div className={`grid gap-1 md:gap-2 flex-1 items-stretch ${visibleCount === 3 ? 'grid-cols-3' : 'grid-cols-2 max-w-3xl mx-auto w-full'}`}>
          {products.slice(0, visibleCount).map((product, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative h-full"
            >
              {idx === 2 && (
                <button
                  onClick={() => {
                    setVisibleCount(2);
                    updateProduct(2, INITIAL_STATE);
                  }}
                  className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ProductColumn 
                index={idx}
                label={`商品 ${String.fromCharCode(65 + idx)}`} 
                data={product} 
                setData={(data) => updateProduct(idx, data)} 
                unitPrice={unitPrices[idx]}
                isWinner={winner === String.fromCharCode(65 + idx)}
                isTriple={visibleCount === 3}
                unitSize={unitSize}
                inputRefs={inputRefs}
                onKeyDown={handleKeyDown}
              />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Thinking Log */}
      <div className="hidden">
        思考ログ：
        1. 商品データを配列管理（products: ProductData[]）にリファクタリングし、商品数が増えてもロジックを変更せずに対応できる汎用性を確保しました。
        2. useRef を用いて全入力欄の参照を一括管理し、Enterキー（モバイルの「次へ」ボタン）押下時にインデックスに基づいて次の入力欄へ自動フォーカスする機能を実装しました。
        3. 遷移順序は「商品nの金額 → 商品nの容量 → 商品n+1の金額」となり、スムーズな連続入力を可能にしました。
        4. iOS/Androidのテンキー入力時でも、確定操作で次の項目へ移動するようイベントハンドリングを最適化しました。
      </div>
    </div>
  );
}

interface ProductColumnProps {
  index: number;
  label: string;
  data: ProductData;
  setData: (data: ProductData) => void;
  unitPrice: number | null;
  isWinner: boolean;
  isTriple: boolean;
  unitSize: number;
  inputRefs: MutableRefObject<(HTMLInputElement | null)[]>;
  onKeyDown: (e: KeyboardEvent, currentIndex: number) => void;
}

function ProductColumn({ 
  index, 
  label, 
  data, 
  setData, 
  unitPrice, 
  isWinner, 
  isTriple, 
  unitSize,
  inputRefs,
  onKeyDown
}: ProductColumnProps) {
  const letter = label.split(' ')[1] || label;
  const isPerItem = !data.quantity || parseFloat(data.quantity) <= 0;

  return (
    <div className={`relative flex flex-col rounded-2xl transition-all duration-500 border-2 h-full ${
      isWinner 
        ? 'bg-yellow-50 border-yellow-400 shadow-md z-10 ring-1 ring-yellow-400' 
        : 'bg-white border-transparent'
    }`}>
      {/* Winner Label */}
      <div className="h-12 flex items-center justify-center">
        <AnimatePresence>
          {isWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="text-yellow-600 flex flex-col items-center gap-0.5"
            >
              <Crown className="w-6 h-6 fill-yellow-400" />
              <span className="text-xs md:text-sm font-black uppercase tracking-tighter">最安値！</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`${isTriple ? 'px-1 md:px-2' : 'px-2 md:px-4'} pb-2 flex flex-col gap-2`}>
        <div className="text-center pt-1 pb-2">
          <span className={`text-4xl md:text-6xl font-black tracking-tighter ${isWinner ? 'text-yellow-700' : 'text-slate-400'}`}>
            {letter}
          </span>
        </div>

        {/* Price Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-sm md:text-base font-bold text-slate-600 uppercase">
            <JapaneseYen className="w-3.5 h-3.5 md:w-4 md:h-4" /> 金額
          </div>
          <div className="relative">
            <input
              ref={(el) => (inputRefs.current[index * 3] = el)}
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value.replace(/[^0-9.]/g, '') })}
              onKeyDown={(e) => onKeyDown(e, index * 3)}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 md:py-3 text-center font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                isTriple ? 'text-xl md:text-3xl' : 'text-3xl md:text-5xl'
              }`}
            />
            <span className="absolute right-2 bottom-2 text-[10px] md:text-xs font-bold text-slate-400">円</span>
          </div>
        </div>

        {/* Quantity & Count Inputs */}
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-sm md:text-base font-bold text-slate-600 uppercase">
              <Scale className="w-3.5 h-3.5 md:w-4 md:h-4" /> 容量
            </div>
            <div className="relative">
              <input
                ref={(el) => (inputRefs.current[index * 3 + 1] = el)}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={data.quantity}
                onChange={(e) => setData({ ...data, quantity: e.target.value.replace(/[^0-9.]/g, '') })}
                onKeyDown={(e) => onKeyDown(e, index * 3 + 1)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 md:py-3 text-center font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isTriple ? 'text-lg md:text-2xl' : 'text-2xl md:text-4xl'
                }`}
              />
              <span className="absolute right-2 bottom-2 text-[10px] md:text-xs font-bold text-slate-400">
                {unitSize >= 1000 ? 'kg' : 'g/ml'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-sm md:text-base font-bold text-slate-600 uppercase">
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> 個数
            </div>
            <div className="relative">
              <input
                ref={(el) => (inputRefs.current[index * 3 + 2] = el)}
                type="text"
                inputMode="numeric"
                placeholder="1"
                value={data.count}
                onChange={(e) => setData({ ...data, count: e.target.value.replace(/[^0-9]/g, '') })}
                onKeyDown={(e) => onKeyDown(e, index * 3 + 2)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 md:py-3 text-center font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isTriple ? 'text-lg md:text-2xl' : 'text-2xl md:text-4xl'
                }`}
              />
              <span className="absolute right-2 bottom-2 text-[10px] md:text-xs font-bold text-slate-400">個</span>
            </div>
          </div>
        </div>

        {/* Unit Price Result */}
        <div className={`mt-1 pt-2 border-t border-slate-100 flex flex-col items-center ${isWinner ? 'border-yellow-200' : ''}`}>
          <span className="text-sm md:text-base font-bold text-slate-600 mb-0.5">
            {isPerItem ? '1個あたり' : '単価'}
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className={`font-black tracking-tighter ${isWinner ? 'text-yellow-600' : (unitPrice !== null ? 'text-slate-900' : 'text-slate-200')} ${
              isTriple ? 'text-xl md:text-4xl' : 'text-4xl md:text-7xl'
            }`}>
              {unitPrice !== null ? Math.round(unitPrice).toLocaleString() : '---'}
            </span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400">
              円{(!isPerItem && unitPrice !== null) && <span className="text-[8px] ml-0.5">/{unitSize >= 1000 ? `${unitSize/1000}kg` : `${unitSize}g`}</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


