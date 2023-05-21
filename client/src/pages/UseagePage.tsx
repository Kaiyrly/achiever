import React, { useState, useEffect } from 'react';

const UsagePage = () => {
  const [language, setLanguage] = useState('en');
  const [content, setContent] = useState('');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    fetch(`/how-to-use-${language}.html`)
      .then(response => response.text())
      .then(data => {
        setContent(data);
      });
  }, [language]);

  return (
    <div>
      {/* <h1>{language === 'en' ? 'How to Use' : 'Как использовать'}</h1> */}
      <select value={language} onChange={handleLanguageChange}>
        <option value='en'>English</option>
        <option value='ru'>Русский</option>
      </select>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default UsagePage;
