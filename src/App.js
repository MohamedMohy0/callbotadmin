import React, { useState } from 'react';

const BOT_TOKEN = '8643702996:AAGqTy6yGWb77RLGiig85SGYC1Ir9DzLzCc';

function App() {
  const [telegramId, setTelegramId] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isLoading, setIsLoading] = useState(false);

  const messages = [
    { value: '', label: '-- اختر رسالة --' },
    { value: "تم التواصل مع المختص بنجاح وسوف يتواصل مك في اقرب وقت ", label: 'الاختيار 1:  المختص رد وهيفتح' },
    { value: "تم التواصل مع المختص ولديه ظروف وفي اقرب وقت يستطيع التواصل معك سيقوم ب التواصل ", label: 'الاختيار 2:  المختص رد وعنده ظرف ' },
    { value: "المختص لم يقم بالرد وتم ترك له رسالة SMS وفي اقرب وقت سيتم التواصل معك", label: 'الاختيار 3:   المختص مردش او كنسل ' },
    { value: "الرقم الذي ارسلته غير صحيح الرجاء التأكد وارسال الرقم بالشكل الصحيح مثل : +201123456789", label: 'الاختيار 4:      رقم خاطئ او رسالة خطأ ' },

  ];

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const sendMessage = async () => {
    if (!telegramId.trim()) {
      showToast(' الرجاء إدخال معرف التليجرام', 'error');
      return;
    }

    if (!selectedMessage) {
      showToast(' الرجاء اختيار رسالة', 'error');
      return;
    }

    if (BOT_TOKEN === 'ضع_التوكن_هنا') {
      showToast(' الرجاء إضافة توكن البوت في الكود', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      showToast(' جاري إرسال الرسالة...', 'info');
      
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramId,
          text: selectedMessage,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();

      if (data.ok) {
        showToast(' تم إرسال الرسالة بنجاح!', 'success');
      } else {
        showToast(` خطأ: ${data.description}`, 'error');
      }

    } catch (error) {
      showToast(' فشل الاتصال بالخادم', 'error');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  React.useEffect(() => {
    if (BOT_TOKEN === 'ضع_التوكن_هنا') {
      showToast(' الرجاء إضافة توكن البوت في الكود', 'error');
    } else {
      showToast(' مرحباً! أدخل ID واختر رسالة', 'info');
    }
  }, []);

  const toastColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
           مرسال التليجرام
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
               معرف التليجرام (ID)
            </label>
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="أدخل معرف المستخدم..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
               اختر الرسالة
            </label>
            <select
              value={selectedMessage}
              onChange={(e) => setSelectedMessage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
              disabled={isLoading}
            >
              {messages.map((msg, index) => (
                <option key={index} value={msg.value}>
                  {msg.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 focus:outline-none ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-l from-purple-600 to-blue-500 hover:shadow-lg'
            }`}
          >
            {isLoading ? ' جاري الإرسال...' : ' إرسال الرسالة'}
          </button>
        </div>
      </div>

      <div
        className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all duration-300 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        } ${toastColors[toast.type]}`}
        style={{ zIndex: 9999 }}
      >
        {toast.message}
      </div>
    </div>
  );
}

export default App;