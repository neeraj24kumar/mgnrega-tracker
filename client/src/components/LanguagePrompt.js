import React from 'react';

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', zIndex: 2000,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const boxStyle = {
  background: '#fff', borderRadius: '1rem', padding: '2rem 3rem', textAlign: 'center', minWidth: 320
};
const btnStyle = {
  margin: '1rem', padding: '1rem 2rem', fontSize: '1.4rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: '#3b82f6', color: '#fff', fontWeight: 600
};

function LanguagePrompt({ onSelect }) {
  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2 style={{marginBottom: 32}}>Choose Language / भाषा चुनें</h2>
        <button style={btnStyle} onClick={() => onSelect('en')}>English</button>
        <button style={btnStyle} onClick={() => onSelect('hi')}>हिन्दी</button>
      </div>
    </div>
  );
}
export default LanguagePrompt;

