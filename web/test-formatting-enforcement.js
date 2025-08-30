// Quick test for formatting enforcement
const fs = require('fs');

async function testFormattingEnforcement() {
    const API_URL = 'http://localhost:3002/api/chat';
    
    const testQuery = {
        message: "What is bread?",
        description: "Simple question to test formatting enforcement"
    };
    
    console.log("Testing Formatting Enforcement...\n");
    console.log(`Question: ${testQuery.message}\n`);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: testQuery.message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Response:");
        console.log(data.answer);
        
        // Check formatting requirements
        const hasMainHeading = (data.answer.match(/^##\s/gm) || []).length >= 3;
        const hasSubHeading = (data.answer.match(/^###\s/gm) || []).length >= 2;
        const hasBulletPoints = data.answer.includes('*') || data.answer.includes('-');
        const wordCount = data.answer.split(/\s+/).length;
        
        console.log("\n--- FORMATTING CHECK ---");
        console.log(`✅ Main headings (##): ${hasMainHeading ? 'PASS' : 'FAIL'} (${(data.answer.match(/^##\s/gm) || []).length} found, need 3+)`);
        console.log(`✅ Sub headings (###): ${hasSubHeading ? 'PASS' : 'FAIL'} (${(data.answer.match(/^###\s/gm) || []).length} found, need 2+)`);
        console.log(`✅ Bullet points: ${hasBulletPoints ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Word count: ${wordCount >= 200 ? 'PASS' : 'FAIL'} (${wordCount} words, need 200+)`);
        
        if (hasMainHeading && hasSubHeading && hasBulletPoints && wordCount >= 200) {
            console.log("🎉 FORMATTING: EXCELLENT - All requirements met!");
        } else {
            console.log("❌ FORMATTING: NEEDS IMPROVEMENT");
        }
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
}

testFormattingEnforcement().catch(console.error);