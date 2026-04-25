import React from 'react';
import {ContractData} from '../types';
import {SignaturePad} from './SignaturePad';
import { Upload, Trash2 } from 'lucide-react';

interface Props {
  data: ContractData;
  onChange: (data: ContractData) => void;
}

export default function ContractForm({data, onChange}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let {name, value} = e.target;
    let updates: Partial<ContractData> = {};
    
    if (name === 'instructorRrn') {
      const numbers = value.replace(/[^\d]/g, '');
      if (numbers.length <= 6) {
        value = numbers;
      } else {
        value = `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
      }
    } else if (name === 'instructorContact') {
      const numbers = value.replace(/[^\d]/g, '');
      if (numbers.startsWith('02')) {
        if (numbers.length > 2 && numbers.length <= 5) value = `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
        else if (numbers.length > 5) value = `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5, 9)}`;
        else value = numbers;
      } else {
        if (numbers.length > 3 && numbers.length <= 6) value = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        else if (numbers.length > 6) value = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
        else value = numbers;
      }
    } else if (name === 'hourlyRate' || name === 'outerHourlyRate') {
      const numbers = value.replace(/[^\d]/g, '');
      value = numbers ? Number(numbers).toLocaleString('ko-KR') : '';
    } else if (name === 'contractStartDate' && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1); // 1년 뒤의 전날까지 (통상적인 1년 계약 만료일)
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        updates.contractEndDate = `${yyyy}-${mm}-${dd}`;
      }
    }

    onChange({...data, ...updates, [name]: value});
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({...data, companyStamp: event.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">계약 정보 입력</h2>
        <p className="text-sm text-gray-500 mt-1">계약서에 들어갈 필수 정보들을 양식에 맞게 입력해주세요.</p>
      </div>

      <div className="space-y-6">
        {/* 지사 선택 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">소속 지사 선택</h3>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['천안', '세종', '평택', '예산'].map((branchName) => (
              <label 
                key={branchName} 
                className={`flex-1 text-center py-2 px-3 rounded-md cursor-pointer text-sm font-medium transition-all ${
                  data.branch === branchName 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="branch"
                  value={branchName}
                  checked={data.branch === branchName}
                  onChange={handleChange}
                  className="hidden"
                />
                {branchName}
              </label>
            ))}
          </div>
        </section>

        {/* 강사 정보 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">1. 강사 기본 정보</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" name="instructorName" value={data.instructorName} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주민등록번호 (13자리)</label>
              <input 
                type="text" 
                name="instructorRrn" 
                value={data.instructorRrn} 
                onChange={handleChange} 
                maxLength={14}
                className={`block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${
                  data.instructorRrn && data.instructorRrn.replace(/[^\d]/g, '').length < 13 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`} 
                placeholder="123456-1234567" 
              />
              {data.instructorRrn && data.instructorRrn.replace(/[^\d]/g, '').length < 13 && (
                <p className="mt-1 text-xs text-red-500">주민등록번호 13자리를 모두 작성해주세요.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input type="text" name="instructorContact" value={data.instructorContact} onChange={handleChange} maxLength={13} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="010-1234-5678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input type="text" name="instructorAddress" value={data.instructorAddress} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="충남 천안시 서북구 늘푸른 1길20, 3층" />
            </div>
          </div>
        </section>

        {/* 계약 조건 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">2. 계약 조건</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계약 시작일</label>
              <input type="date" name="contractStartDate" value={data.contractStartDate} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계약 종료일</label>
              <input type="date" name="contractEndDate" value={data.contractEndDate} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시급 (원)</label>
              <input type="text" name="hourlyRate" value={data.hourlyRate} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="30,000" />
            </div>
          </div>
        </section>

        {/* 계약 일자 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">3. 계약 체결일</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">년도</label>
              <input type="text" name="contractYear" value={data.contractYear} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">월</label>
              <input type="text" name="contractMonth" value={data.contractMonth} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">일</label>
              <input type="text" name="contractDay" value={data.contractDay} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" />
            </div>
          </div>
        </section>

        {/* 서명 및 도장 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">4. 서명 및 직인 등록 (자동 저장)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">본사(장고교육개발원) 직인 업로드 (PNG 투명 배경 권장)</label>
            <p className="text-xs text-indigo-600 mb-3 font-medium">한 번 올려두시면 이 브라우저 기억장치에 저장되어 계속 재사용됩니다.</p>
            {!data.companyStamp ? (
              <label htmlFor="stamp-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer w-full">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex justify-center text-sm text-gray-600 mt-2">
                    <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500 px-2 py-1">
                      이미지 파일 선택
                      <input id="stamp-upload" name="stamp-upload" type="file" accept="image/*" className="hidden" onChange={handleStampUpload} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">배경이 투명한 PNG 도장 파일 권장</p>
                </div>
              </label>
            ) : (
               <div className="mt-1 relative border rounded-md p-4 flex justify-center items-center bg-zinc-50">
                  <img src={data.companyStamp} alt="본사 직인" className="h-24 object-contain mix-blend-multiply" />
                  <button onClick={() => onChange({...data, companyStamp: null})} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">강사 서명 직접 입력</label>
            <SignaturePad 
              onSign={(sig) => onChange({...data, instructorSignature: sig})} 
              onClear={() => onChange({...data, instructorSignature: null})}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
