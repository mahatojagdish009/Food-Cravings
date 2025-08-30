// Quick test to populate the database
async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    const response = await fetch('/api/populate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', result);
      alert(`✅ Successfully populated database with ${result.uploaded} food items!`);
    } else {
      console.error('❌ Error:', result);
      alert(`❌ Error: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Failed to populate database:', error);
    alert(`❌ Failed: ${error.message}`);
  }
}

// Auto-run when page loads
if (typeof window !== 'undefined') {
  window.populateDatabase = populateDatabase;
  
  // Add a button to the page for manual trigger
  setTimeout(() => {
    const button = document.createElement('button');
    button.innerHTML = '🚀 Populate Database with New Foods';
    button.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 1000;
      padding: 12px 16px;
      background: linear-gradient(45deg, #f97316, #dc2626);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
    `;
    button.onclick = populateDatabase;
    document.body.appendChild(button);
  }, 1000);
}