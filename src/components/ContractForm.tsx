import React, { useState } from 'react';
import {ContractData} from '../types';
import {SignaturePad} from './SignaturePad';
import { Upload, Trash2 } from 'lucide-react';

interface Props {
  data: ContractData;
  onChange: (data: ContractData) => void;
}

export default function ContractForm({data, onChange}: Props) {
  const [driveStamps, setDriveStamps] = useState<{name: string, base64: string}[]>([]);
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);

  const fetchStampsFromDrive = async () => {
    setIsLoadingStamps(true);
    try {
      // 이 URL은 이전에 제공해주신 업로드용 구글 앱스 스크립트입니다.
      // 해당 스크립트에 doGet 함수(해당 폴더의 이미지들을 가져오는 기능)를 추가 배포해야 동작합니다.
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8KEbbIFicI5R7RQQqT46NykVPYLSzfl0JYqfsru0zEyNpDVhMBDdBW8C1S2946Acnow/exec";
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const result = await res.json();
      if (Array.isArray(result)) {
        setDriveStamps(result);
      } else {
        alert("구글 드라이브에서 이미지를 가져올 수 없습니다. 구글 스크립트에 doGet 함수 설정이 필요합니다.");
      }
    } catch(e) {
      alert("도장을 불러오는데 실패했습니다. (Failed to fetch)\n\n[해결방법]\n기존 배포하신 구글 스크립트 코드에 '해당 폴더의 이미지 목록을 반환하는 doGet 함수'를 추가한 후 '새 버전'으로 배포해주셔야 합니다.");
    } finally {
      setIsLoadingStamps(false);
    }
  };

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

  const compressImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;
        
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL(file.type || 'image/jpeg', 0.8));
        } else {
          callback(e.target?.result as string);
        }
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (base64) => {
        onChange({...data, companyStamp: base64});
      });
    }
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
              <input type="text" name="instructorContact" value={data.instructorContact} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="010-1234-5678" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">본사(장고교육개발원) 직인 선택 또는 업로드 (PNG 투명 배경 권장)</label>
            <p className="text-xs text-indigo-600 mb-3 font-medium">한 번 선택/올려두시면 이 브라우저 기억장치에 저장되어 계속 재사용됩니다.</p>
            
            {!data.companyStamp ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={fetchStampsFromDrive}
                    disabled={isLoadingStamps}
                    className="col-span-3 mb-2 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoadingStamps ? '불러오는 중...' : '구글 드라이브(업체 계약서 폴더)에서 도장 이미지 불러오기'}
                  </button>

                  {driveStamps.length > 0 ? (
                    driveStamps.map((stamp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChange({...data, companyStamp: stamp.base64})}
                        className="border-2 border-gray-200 rounded-md p-3 hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition-colors bg-white flex flex-col items-center justify-center min-h-[100px]"
                      >
                        <div className="w-16 h-16 relative flex items-center justify-center overflow-hidden mb-2">
                          <img src={stamp.base64} alt={stamp.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 truncate w-full px-1">{stamp.name}</span>
                      </button>
                    ))
                  ) : (
                    [
                      { name: '세종', file: '/세종도장.png' },
                      { name: '천안', file: '/천안도장.png' },
                      { name: '평택', file: '/평택도장.png' }
                    ].map((stamp) => (
                      <button
                        key={stamp.name}
                        type="button"
                        onClick={() => onChange({...data, companyStamp: stamp.file})}
                        className="border-2 border-gray-200 rounded-md p-3 hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition-colors bg-white flex flex-col items-center justify-center min-h-[100px]"
                      >
                        <div className="w-16 h-16 relative flex items-center justify-center overflow-hidden mb-2">
                           <img src={stamp.file} alt={`${stamp.name} 도장`} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{stamp.name} 직인 선택</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">또는 직접 업로드</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <label className="relative flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer w-full overflow-hidden">
                  <input id="stamp-upload" name="stamp-upload" type="file" accept="image/jpeg, image/png, image/jpg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" onChange={handleStampUpload} />
                  <div className="space-y-1 text-center pointer-events-none">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex justify-center text-sm text-gray-600 mt-2">
                      <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500 px-2 py-1">
                        이미지 파일 선택
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">직접 파일에서 찾기</p>
                  </div>
                </label>
              </div>
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
