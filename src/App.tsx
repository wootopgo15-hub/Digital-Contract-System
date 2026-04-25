import React, { useState, useEffect } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import ContractForm from './components/ContractForm';
import ContractPreview from './components/ContractPreview';
import CompanyContractForm from './components/CompanyContractForm';
import CompanyContractPreview from './components/CompanyContractPreview';
import Home from './components/Home';
import Login from './components/Login';
import { ContractData, CompanyContractData } from './types';
import { FileText, ChevronLeft, Download, Mail, X, CheckCircle2, Loader2 } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'instructor' | 'company'>('home');
  
  const initialStamp = typeof window !== 'undefined' ? localStorage.getItem('janggoStamp') : null;

  const [data, setData] = useState<ContractData>({
    branch: '천안',
    instructorName: '',
    contractStartDate: '',
    contractEndDate: '',
    hourlyRate: '',
    outerHourlyRate: '',
    contractYear: new Date().getFullYear().toString().slice(2, 4),
    contractMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    contractDay: new Date().getDate().toString().padStart(2, '0'),
    instructorAddress: '',
    instructorContact: '',
    instructorRrn: '',
    companyStamp: initialStamp,
    instructorSignature: null,
  });

  const [companyData, setCompanyData] = useState<CompanyContractData>({
    branch: '천안',
    centerName: '',
    contractStartDate: '',
    contractEndDate: '',
    subject1: '', day1: '', time1: '',
    subject2: '', day2: '', time2: '',
    subject3: '', day3: '', time3: '',
    subject4: '', day4: '', time4: '',
    subject5: '', day5: '', time5: '',
    hourlyRate: '',
    paymentDay: '',
    bankAccount1: '하나은행, 최유정(장고교육개발원) 계좌번호 : 621 - 910510 - 28907',
    bankAccount2: '농협은행, 최유정(장고교육개발원) 계좌번호 : 302 - 1757 - 7312 - 41',
    contractYear: new Date().getFullYear().toString().slice(2, 4),
    contractMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    contractDay: new Date().getDate().toString().padStart(2, '0'),
    companyBusinessNumber: '',
    companyAddress: '',
    companyRepresentative: '',
    companyContact: '',
    companyEmail: '',
    companySignature: null,
    janggoStamp: initialStamp,
  });

  // 본사 도장을 로컬 스토리지에 동기화
  useEffect(() => {
    if (data.companyStamp && data.companyStamp !== localStorage.getItem('janggoStamp')) {
      localStorage.setItem('janggoStamp', data.companyStamp);
      setCompanyData(prev => ({ ...prev, janggoStamp: data.companyStamp }));
    } else if (data.companyStamp === null && localStorage.getItem('janggoStamp')) {
      // 삭제 처리
      localStorage.removeItem('janggoStamp');
      setCompanyData(prev => ({ ...prev, janggoStamp: null }));
    }
  }, [data.companyStamp]);

  useEffect(() => {
    if (companyData.janggoStamp && companyData.janggoStamp !== localStorage.getItem('janggoStamp')) {
      localStorage.setItem('janggoStamp', companyData.janggoStamp);
      setData(prev => ({ ...prev, companyStamp: companyData.janggoStamp }));
    } else if (companyData.janggoStamp === null && localStorage.getItem('janggoStamp')) {
      // 삭제 처리
      localStorage.removeItem('janggoStamp');
      setData(prev => ({ ...prev, companyStamp: null }));
    }
  }, [companyData.janggoStamp]);

  const isCompany = currentView === 'company';

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [emailData, setEmailData] = useState({
    sender: 'cheonan@janggostory.com',
    to: '',
    subject: '',
    message: ''
  });

  // 뷰가 변경될 때마다 이메일 초기 메시지 맞춰주기
  useEffect(() => {
    setEmailData(prev => ({
      ...prev,
      subject: currentView === 'company' ? '장고교육개발원 프로그램 위탁계약서 발송' : '장고교육개발원 시니어 강사 계약서 발송',
      message: `안녕하세요. 장고교육개발원 ${currentView === 'company' ? '위탁계약서' : '시니어 강사 계약서'}입니다. 확인 부탁드립니다.`
    }));
  }, [currentView]);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePdf = async () => {
    // 1. 타겟 컨텐츠 원본 요소 가져오기
    const originalContent = document.getElementById('pdf-content');
    
    if (!originalContent) {
      window.print();
      return;
    }
    
    // 오프스크린(화면 밖) 컨테이너 생성 및 강제 규격 설정 (크기가 0이 되는 현상 원천 차단)
    const offScreenDiv = document.createElement('div');
    offScreenDiv.style.position = 'absolute';
    offScreenDiv.style.left = '-9999px';
    offScreenDiv.style.top = '0';
    offScreenDiv.style.width = '850px';
    offScreenDiv.style.backgroundColor = '#ffffff'; // 캡처 배경색 보장
    document.body.appendChild(offScreenDiv);

    // 요소 복제 후 오프스크린 컨테이너에 삽입하여 화면 밖에서 완벽하게 렌더링되게 함
    const clonedNode = originalContent.cloneNode(true) as HTMLElement;
    offScreenDiv.appendChild(clonedNode);

    const pages = clonedNode.querySelectorAll('.pdf-page');

    if (!pages || pages.length === 0) {
      document.body.removeChild(offScreenDiv);
      window.print();
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // 상하단 15mm 여백

      const timestampHex = new Date().getTime().toString(16).toUpperCase();
      let currentPageNum = 1;

      // 캡처 최적화 설정.
      const captureOptions = {
        quality: 1.0, 
        backgroundColor: '#ffffff',
        pixelRatio: 2, // 선명도 향상 (레티나 디스플레이 수준)
        cacheBust: true,
        style: {
          margin: '0',
          transform: 'none',
        }
      };

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        
        // 캔버스 크기 제약에 의한 사이드 이펙트(margin 병합 등) 방지
        pageElement.style.margin = '0';
        
        let dataUrl = 'data:,';
        let attempts = 0;
        
        // JPEG로 시도
        while (dataUrl === 'data:,' && attempts < 3) {
          try {
            dataUrl = await toJpeg(pageElement, captureOptions);
          } catch (e) {
            console.warn(`Retry ${attempts + 1} JPEG failed`);
          }
          attempts++;
          if (dataUrl === 'data:,') await new Promise(resolve => setTimeout(resolve, 500));
        }

        // JPEG 실패 시 PNG로 전환하여 시도
        if (!dataUrl || dataUrl === 'data:,') {
          try {
            dataUrl = await toPng(pageElement, captureOptions);
          } catch(e) { }
        }
        
        if (!dataUrl || dataUrl === 'data:,') {
          throw new Error(`Capture completely failed for page ${i}`);
        }
        
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        const fileType = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
        // 패딩이 이미 포함되어 있으므로 화면 꽉 차게 렌더링
        pdf.addImage(dataUrl, fileType, 0, 0, pdfWidth, pdfHeight);

        // 시리얼 번호는 작게 우측 하단에 추가 (배경 없이 자연스럽게)
        const serial = `S/N: JG-${timestampHex}-${currentPageNum}`;
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(serial, pdfWidth - 53, pageHeight - 5);

        currentPageNum++;
      }
      
      let fileName = '';
      if (isCompany) {
        const dateStr = `20${companyData.contractYear}${companyData.contractMonth}${companyData.contractDay}`;
        const nameStr = companyData.centerName || '미입력업체';
        fileName = `${nameStr}_위탁계약서_${dateStr}.pdf`;
      } else {
        const dateStr = `20${data.contractYear}${data.contractMonth}${data.contractDay}`;
        const nameStr = data.instructorName || '미입력강사';
        fileName = `${nameStr}_시니어강사계약서_${dateStr}.pdf`;
      }
      
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF 생성 fallback:', err);
      // 에러 메시지 알람 띄우지 않고 바로 브라우저 기본 인쇄 창으로 부드럽게 Fallback
      window.print();
    } finally {
      // 복제했던 오프스크린 DOM 정리
      if (document.body.contains(offScreenDiv)) {
        document.body.removeChild(offScreenDiv);
      }
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus('sending');
    
    try {
      // 1. PDF 캡처 로직 (동일)
      const originalContent = document.getElementById('pdf-content');
      if (!originalContent) throw new Error('No content');

      const offScreenDiv = document.createElement('div');
      offScreenDiv.style.position = 'absolute';
      offScreenDiv.style.left = '-9999px';
      offScreenDiv.style.top = '0';
      offScreenDiv.style.width = '850px';
      offScreenDiv.style.backgroundColor = '#ffffff';
      document.body.appendChild(offScreenDiv);

      const clonedNode = originalContent.cloneNode(true) as HTMLElement;
      offScreenDiv.appendChild(clonedNode);

      const pages = clonedNode.querySelectorAll('.pdf-page');
      if (!pages || pages.length === 0) {
        document.body.removeChild(offScreenDiv);
        throw new Error('No pages');
      }

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const captureOptions = {
        quality: 1.0, 
        backgroundColor: '#ffffff',
        pixelRatio: 2, 
        cacheBust: true,
        style: { margin: '0', transform: 'none' }
      };

      const timestampHex = new Date().getTime().toString(16).toUpperCase();
      let currentPageNum = 1;

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        pageElement.style.margin = '0';
        
        let dataUrl = 'data:,';
        let attempts = 0;
        
        while (dataUrl === 'data:,' && attempts < 3) {
          try { dataUrl = await toJpeg(pageElement, captureOptions); } catch (e) { }
          attempts++;
          if (dataUrl === 'data:,') await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (!dataUrl || dataUrl === 'data:,') {
          try { dataUrl = await toPng(pageElement, captureOptions); } catch(e) { }
        }
        
        if (!dataUrl || dataUrl === 'data:,') throw new Error(`Capture failed`);
        
        if (i > 0) pdf.addPage();
        
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const fileType = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
        pdf.addImage(dataUrl, fileType, 0, 0, pdfWidth, pdfHeight);

        // 시리얼 번호는 작게 우측 하단에 추가 (배경 없이 자연스럽게)
        const serial = `S/N: JG-${timestampHex}-${currentPageNum}`;
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(serial, pdfWidth - 53, pageHeight - 5);

        currentPageNum++;
      }

      // Base64 문자열 추출 (data:application/pdf;filename=generated.pdf;base64, 이후의 값)
      const pdfBase64DataURL = pdf.output('datauristring');
      const pdfBase64 = pdfBase64DataURL.split(',')[1];
      
      document.body.removeChild(offScreenDiv);

      // 파일명 설정
      let fileName = '';
      if (isCompany) {
        const dateStr = `20${companyData.contractYear}${companyData.contractMonth}${companyData.contractDay}`;
        const nameStr = companyData.centerName || '미입력업체';
        fileName = `${nameStr}_위탁계약서_${dateStr}.pdf`;
      } else {
        const dateStr = `20${data.contractYear}${data.contractMonth}${data.contractDay}`;
        const nameStr = data.instructorName || '미입력강사';
        fileName = `${nameStr}_시니어강사계약서_${dateStr}.pdf`;
      }

      // 계약 정보를 깔끔한 텍스트로 변환하는 함수
      const formatContractData = () => {
        if (isCompany) {
          const c = companyData;
          return `[위탁계약 정보]
기관명: ${c.centerName || '미입력'}
대표자: ${c.companyRepresentative || '미입력'}
사업자번호: ${c.companyBusinessNumber || '미입력'}
기관주소: ${c.companyAddress || '미입력'}
계약시작일: ${c.contractStartDate || '미입력'}
계약종료일: ${c.contractEndDate || '미입력'}
단가(비용): ${c.hourlyRate || '미입력'}원
`;
        } else {
          const d = data;
          return `[강사계약 정보]
성명: ${d.instructorName || '미입력'}
거주지: ${d.instructorAddress || '미입력'}
연락처: ${d.instructorContact || '미입력'}
주민번호: ${d.instructorRrn || '미입력'}
계약시작일: ${d.contractStartDate || '미입력'}
계약종료일: ${d.contractEndDate || '미입력'}
시급: ${d.hourlyRate || '미입력'}원
`;
        }
      };

      const payload = {
        action: 'sendEmail',
        to: emailData.to,
        sender: emailData.sender,
        subject: emailData.subject,
        message: emailData.message,
        contractDetails: formatContractData(),
        pdfName: fileName,
        pdfBase64: pdfBase64
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycby8KEbbIFicI5R7RQQqT46NykVPYLSzfl0JYqfsru0zEyNpDVhMBDdBW8C1S2946Acnow/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Send failed');
      
      setEmailStatus('success');
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailStatus('idle');
        setEmailData(prev => ({ ...prev, to: '' }));
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('전송에 실패했습니다. (Failed to fetch)\n\n[해결방법]\n구글 스크립트 배포 시 "액세스할 수 있는 사용자(Who has access)"를 반드시 "모든 사용자(Anyone)"로 설정하여 새 버전으로 배포해주세요.');
      setEmailStatus('idle');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (currentView === 'home') {
    return <Home onSelect={(type) => {
      if (type === 'instructor') setCurrentView('instructor');
      if (type === 'company') setCurrentView('company');
    }} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between no-print shrink-0 shadow-sm z-50">
        <div className="flex items-center sm:gap-2">
          <button 
            onClick={() => setCurrentView('home')}
            className="p-2 -ml-2 mr-1 sm:mr-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center shrink-0"
            aria-label="홈으로 가기"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight shrink-0">전자 계약 시스템</h1>
          </div>
          <h1 className="sm:hidden text-base font-bold text-gray-900 tracking-tight shrink-0 ml-1">
            {isCompany ? '업체 계약서 작성' : '강사 계약서 작성'}
          </h1>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleGeneratePdf}
             className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm shrink-0"
           >
             <Download className="w-4 h-4" />
             <span className="hidden sm:inline">PDF 만들기</span>
             <span className="sm:hidden">PDF</span>
           </button>
           <button 
             onClick={() => setShowEmailModal(true)}
             className="flex items-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm shrink-0"
           >
             <Mail className="w-4 h-4" />
             <span className="hidden sm:inline">이메일 전송</span>
             <span className="sm:hidden">이메일</span>
           </button>
        </div>
      </header>

      <div className="xl:hidden flex border-b bg-white shrink-0 z-40 shadow-sm">
        <button 
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'form' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('form')}
        >
          정보 입력
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('preview')}
        >
          계약서 미리보기
        </button>
      </div>

      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden no-print relative">
        <div className={`w-full xl:w-[450px] 2xl:w-[550px] shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto overscroll-contain ${activeTab === 'form' ? 'block' : 'hidden xl:block'}`}>
          <div className="p-4 sm:p-6 pb-32">
            {isCompany ? (
              <CompanyContractForm data={companyData} onChange={setCompanyData} />
            ) : (
              <ContractForm data={data} onChange={setData} />
            )}
          </div>
        </div>

        <div className={`flex-1 h-full overflow-y-auto overscroll-contain p-3 sm:p-6 md:p-8 bg-gray-100 ${activeTab === 'preview' ? 'block' : 'hidden xl:block'}`}>
          <div className="max-w-[850px] mx-auto transition-all duration-300 ease-in-out pb-32">
            <div id="pdf-content" className="bg-white">
              {isCompany ? (
                <CompanyContractPreview data={companyData} />
              ) : (
                <ContractPreview data={data} />
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="hidden print-only">
        {isCompany ? (
          <CompanyContractPreview data={companyData} />
        ) : (
          <ContractPreview data={data} />
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                이메일 전송
              </h2>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
                disabled={emailStatus === 'sending'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {emailStatus === 'success' ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-white">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">전송 성공!</h3>
                <p className="text-gray-500 break-keep">
                  입력하신 이메일 주소로 계약서 발송 요청이 <br />
                  성공적으로 처리되었습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="p-6 flex flex-col gap-4 bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">보내는 사람 (지사/센터 선택)</label>
                  <select 
                    required autoFocus
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-shadow bg-white"
                    value={emailData.sender}
                    onChange={(e) => setEmailData({...emailData, sender: e.target.value})}
                    disabled={emailStatus === 'sending'}
                  >
                    <option value="" disabled>보내는 지사를 선택하세요</option>
                    <option value="cheonan@janggostory.com">천안 (cheonan@janggostory.com)</option>
                    <option value="sejong@janggostory.com">세종 (sejong@janggostory.com)</option>
                    <option value="pyeongtaek@janggostory.com">평택 (pyeongtaek@janggostory.com)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">받는 사람 (이메일 주소 직접 입력)</label>
                  <input 
                    type="email" 
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-shadow"
                    placeholder="example@email.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                    disabled={emailStatus === 'sending'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">메일 제목</label>
                  <input 
                    type="text" 
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-shadow"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    disabled={emailStatus === 'sending'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">전송할 메시지 내용</label>
                  <textarea 
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border resize-none transition-shadow"
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    disabled={emailStatus === 'sending'}
                  />
                </div>
                
                <div className="mt-4 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                    disabled={emailStatus === 'sending'}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={emailStatus === 'sending' || !emailData.to.trim()}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emailStatus === 'sending' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> 발송 중...</>
                    ) : (
                      '이메일 보내기'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
