import React, { useState } from 'react';
import { CompanyContractData } from '../types';
import { Upload, Trash2, Printer, CheckCircle2, Loader2, CloudUpload, Plus } from 'lucide-react';

interface Props {
  data: CompanyContractData;
  onChange: (data: CompanyContractData) => void;
}

export default function CompanyContractForm({ data, onChange }: Props) {
  const [driveStatus, setDriveStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [driveStamps, setDriveStamps] = useState<{name: string, base64: string}[]>([]);
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);

  const fetchStampsFromDrive = async () => {
    setIsLoadingStamps(true);
    try {
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
  
  const [scheduleCount, setScheduleCount] = useState(() => {
    let count = 1;
    for (let i = 5; i >= 1; i--) {
      if (data[`subject${i}` as keyof CompanyContractData] || 
          data[`day${i}` as keyof CompanyContractData] || 
          data[`time${i}` as keyof CompanyContractData]) {
        count = i;
        break;
      }
    }
    return count;
  });

  const uploadToGoogleDrive = async (file: File, base64Data: string) => {
    setDriveStatus('uploading');
    try {
      const payload = {
        name: `${data.centerName || '미입력'}_도장사진_${new Date().toISOString().slice(0, 10)}.${file.name.split('.').pop()}`,
        mimeType: file.type,
        data: base64Data
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycby8KEbbIFicI5R7RQQqT46NykVPYLSzfl0JYqfsru0zEyNpDVhMBDdBW8C1S2946Acnow/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      setDriveStatus('success');
      setTimeout(() => setDriveStatus('idle'), 3000);
    } catch (err) {
      console.error('GAS Upload Error:', err);
      // Fallback for CORS issues sometimes present with GAS: wait a bit and show success if no hard error
      setDriveStatus('error');
      setTimeout(() => setDriveStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    let updates: Partial<CompanyContractData> = {};

    if (name === 'hourlyRate') {
      const numbers = value.replace(/[^\d]/g, '');
      value = numbers ? Number(numbers).toLocaleString('ko-KR') : '';
    } else if (name === 'contractStartDate' && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1); // 1년 뒤 -1일
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        updates.contractEndDate = `${yyyy}-${mm}-${dd}`;
      }
    }

    onChange({ ...data, ...updates, [name]: value });
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
      if (e.target?.result) img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (base64) => {
        onChange({ ...data, janggoStamp: base64 });
      });
    }
  };

  const handleCompanyStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        onChange({ ...data, companySignature: dataUrl });
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          uploadToGoogleDrive(file, base64Data);
        }
      });
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">업체 계약 정보 입력</h2>
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

        {/* 기관(갑) 정보 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">1. 기관(갑) 정보</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">센터명 / 기관명</label>
              <input type="text" name="centerName" value={data.centerName} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="OO요양원" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사업자번호 <span className="text-gray-400 font-normal text-xs">(선택)</span></label>
              <input type="text" name="companyBusinessNumber" value={data.companyBusinessNumber} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="123-45-67890" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대표자명 <span className="text-gray-400 font-normal text-xs">(선택)</span></label>
              <input type="text" name="companyRepresentative" value={data.companyRepresentative} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="김대표" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">상세 주소 <span className="text-gray-400 font-normal text-xs">(선택)</span></label>
              <input type="text" name="companyAddress" value={data.companyAddress} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="충남 천안시 서북구 늘푸른 1길20, 3층" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처 <span className="text-gray-400 font-normal text-xs">(선택)</span></label>
              <input type="text" name="companyContact" value={data.companyContact} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="02-123-4567" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-gray-400 font-normal text-xs">(선택)</span></label>
              <input type="text" name="companyEmail" value={data.companyEmail} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="example@email.com" />
            </div>
          </div>
        </section>

        {/* 위탁 교육 조건 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">2. 위탁 교육 조건</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계약 시작일</label>
              <input type="date" name="contractStartDate" value={data.contractStartDate} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계약 종료일 (1년 자동)</label>
              <input type="date" name="contractEndDate" value={data.contractEndDate} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 pt-2 border-t border-gray-50 mt-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">시간표 설정 (최대 5개)</label>
              {scheduleCount < 5 && (
                <button 
                  type="button" 
                  onClick={() => setScheduleCount(prev => prev + 1)}
                  className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded flex items-center hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" /> 추가
                </button>
              )}
            </div>
            {Array.from({ length: scheduleCount }, (_, i) => i + 1).map(idx => (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                <div className="grid grid-cols-[4fr_2fr_3fr] sm:grid-cols-[5fr_2fr_3.5fr] gap-1.5 sm:gap-2 flex-1">
                  <input 
                    type="text" 
                    name={`subject${idx}`} 
                    value={data[`subject${idx}` as keyof CompanyContractData] as string} 
                    onChange={handleChange} 
                    className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-[11px] sm:text-sm p-1.5 sm:p-2" 
                    placeholder="음악,체조,전래,인지놀이,노래교실" 
                  />
                  <select 
                    name={`day${idx}`} 
                    value={data[`day${idx}` as keyof CompanyContractData] as string} 
                    onChange={handleChange} 
                    className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-[13px] sm:text-sm p-1.5 sm:p-2 text-center px-1 bg-white cursor-pointer" 
                  >
                    <option value="" disabled>요일</option>
                    <option value="월">월</option>
                    <option value="화">화</option>
                    <option value="수">수</option>
                    <option value="목">목</option>
                    <option value="금">금</option>
                    <option value="토">토</option>
                    <option value="일">일</option>
                  </select>
                  <input 
                    type="time" 
                    name={`time${idx}`} 
                    value={data[`time${idx}` as keyof CompanyContractData] as string} 
                    onChange={handleChange} 
                    className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-[13px] sm:text-sm p-1.5 sm:p-2 text-center px-0.5 sm:px-2 bg-white cursor-pointer" 
                  />
                </div>
                {idx === scheduleCount && idx > 1 && (
                  <button 
                    type="button"
                    onClick={() => {
                      setScheduleCount(prev => prev - 1);
                      onChange({
                        ...data,
                        [`subject${idx}`]: '',
                        [`day${idx}`]: '',
                        [`time${idx}`]: ''
                      });
                    }}
                    className="text-red-500 p-2 border border-red-200 bg-red-50 hover:bg-red-100 rounded-md transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">교육비 (1시간 기준)</label>
              <input type="text" name="hourlyRate" value={data.hourlyRate} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" placeholder="60,000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">입금일 (매월)</label>
              <div className="flex items-center">
                <input type="text" name="paymentDay" value={data.paymentDay} onChange={handleChange} className="block w-20 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 text-center" placeholder="25" />
                <span className="ml-2 text-sm text-gray-600">일</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호 1</label>
              <input type="text" name="bankAccount1" value={data.bankAccount1} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호 2</label>
              <input type="text" name="bankAccount2" value={data.bankAccount2} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
          </div>
        </section>

        {/* 계약 체결일 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">3. 계약 일자</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">년도</label>
              <input type="text" name="contractYear" value={data.contractYear} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">월</label>
              <input type="text" name="contractMonth" value={data.contractMonth} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">일</label>
              <input type="text" name="contractDay" value={data.contractDay} onChange={handleChange} className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5" />
            </div>
          </div>
        </section>

        {/* 기관(갑) 서명 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">4. 기관(갑) 서명 및 직인 안내</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-center text-gray-500 mb-6">
            <Printer className="w-6 h-6 text-gray-400" />
            <p className="font-medium tracking-tight text-gray-700">출력 후 도장을 찍어주세요.</p>
            <p className="text-xs">이 계약서는 전자 날인 없이, 인쇄 후 기관(갑)의 직접 날인 및 서명이 필요합니다.</p>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">선택사항: 스캔본이나 기관장 명판/도장 이미지 업로드</label>
            <div className="flex items-center justify-center w-full">
              <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 border-blue-200 transition-colors overflow-hidden">
                <input id="company-stamp-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" accept="image/jpeg, image/png, image/jpg, image/webp" onChange={handleCompanyStampUpload} />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                  <Upload className="w-8 h-8 mb-3 text-blue-400" />
                  <p className="mb-2 text-sm text-blue-600 font-semibold">클릭하여 이미지 업로드</p>
                  <p className="text-xs text-blue-400">PNG, JPG (MAX. 2MB)</p>
                </div>
              </label>
            </div>
            
            {data.companySignature && (
               <div className="mt-4 relative inline-block border rounded-lg p-2 bg-gray-50">
                 <img src={data.companySignature} alt="업로드된 도장" className="h-24 w-auto object-contain" />
                 <button
                   type="button"
                   onClick={() => onChange({...data, companySignature: null})}
                   className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            )}
            
            {driveStatus === 'uploading' && (
              <div className="mt-4 flex items-center justify-center text-sm text-indigo-600 bg-indigo-50 p-3 rounded-md">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                구글 드라이브 '업체 계약서' 폴더에 저장 중입니다...
              </div>
            )}
            {driveStatus === 'success' && (
              <div className="mt-4 flex items-center justify-center text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                성공적으로 구글 드라이브에 백업되었습니다!
              </div>
            )}
            {driveStatus === 'error' && (
              <div className="mt-4 flex items-center justify-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                구글 드라이브 백업에 실패했습니다. 화면 출력에는 문제 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 본사(을) 도장 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">5. 본사(을) 도장 등록 (자동 저장)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">장고교육개발원 도장 선택 또는 업로드 (PNG 투명 배경 권장)</label>
            <p className="text-xs text-indigo-600 mb-3 font-medium">한 번 선택/올려두시면 이 브라우저 기억장치에 저장되어 계속 재사용됩니다.</p>
            {data.janggoStamp ? (
              <div className="relative inline-block border rounded-lg p-2 bg-gray-50">
                <img src={data.janggoStamp} alt="본사 도장" className="h-24 w-auto object-contain mix-blend-multiply" />
                <button
                  type="button"
                  onClick={() => onChange({...data, janggoStamp: null})}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
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
                        onClick={() => onChange({...data, janggoStamp: stamp.base64})}
                        className="border-2 border-gray-200 rounded-md p-3 hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition-colors bg-white flex flex-col items-center justify-center min-h-[100px]"
                      >
                        <div className="w-16 h-16 relative flex items-center justify-center overflow-hidden mb-2">
                           <img src={stamp.base64} alt={`${stamp.name} 도장`} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 truncate w-full px-1 text-center">{stamp.name}</span>
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
                        onClick={() => onChange({...data, janggoStamp: stamp.file})}
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

                <div className="flex items-center justify-center w-full">
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
                    <input id="janggo-stamp-upload-company" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" accept="image/jpeg, image/png, image/jpg, image/webp" onChange={handleStampUpload} />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 font-semibold">직접 파일에서 찾기</p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
