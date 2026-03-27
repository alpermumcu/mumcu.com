#!/usr/bin/env node

/**
 * Quick ORCID Upload Script
 * Batch import for ORCID profile 0009-0004-1281-3751
 * 
 * Requirements:
 * 1. ORCID Access Token (OAuth 2.0)
 * 2. ORCID ID: 0009-0004-1281-3751
 * 3. Node.js with fetch API
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  ORCID_ID: "0009-0004-1281-3751",
  ACCESS_TOKEN: process.env.ORCID_TOKEN || "YOUR_ACCESS_TOKEN_HERE", // Set your token here
  BASE_URL: "https://api.orcid.org/v3.0",
  DATA_FILE: "orcid-profile-data.json",
  
  // ORCID API endpoints
  ENDPOINTS: {
    EMPLOYMENT: "/{orcid}/employment",
    EDUCATION: "/{orcid}/education",
    WORK: "/{orcid}/work",
    RECORD: "/{orcid}/record"
  }
};

class QuickORCIDUploader {
  constructor() {
    if (CONFIG.ACCESS_TOKEN === "YOUR_ACCESS_TOKEN_HERE") {
      console.error("❌ ERROR: Please set your ORCID access token");
      console.log("\n🔑 How to get an access token:");
      console.log("1. Go to: https://orcid.org/developers");
      console.log("2. Login with your ORCID account (0009-0004-1281-3751)");
      console.log("3. Go to 'Developer Tools' > 'Register your application'");
      console.log("4. Create a 'Public Client' application");
      console.log("5. Redirect URI: https://localhost");
      console.log("6. Get client_id (starts with APP-)");
      console.log("\n📝 Quick token generation:");
      console.log("Open this URL in browser (replace YOUR_CLIENT_ID):");
      console.log("https://orcid.org/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://localhost&scope=/authenticate");
      console.log("\n💡 Or use manual method below:");
      process.exit(1);
    }

    this.headers = {
      'Authorization': `Bearer ${CONFIG.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async makeRequest(endpoint, method = 'POST', data = null) {
    const url = `${CONFIG.BASE_URL}${endpoint.replace('{orcid}', CONFIG.ORCID_ID)}`;
    console.log(`📡 ${method} ${url}`);
    
    const options = {
      method,
      headers: this.headers
    };

    if (data) {
      options.body = JSON.stringify(data);
      console.log(`📦 Payload: ${JSON.stringify(data).substring(0, 100)}...`);
    }

    try {
      const response = await fetch(url, options);
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
        console.error(`Response: ${responseText.substring(0, 200)}`);
        return { success: false, error: responseText };
      }

      return { success: true, data: responseText ? JSON.parse(responseText) : null };
    } catch (error) {
      console.error(`❌ Network error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    console.log("🔗 Testing ORCID API connection...");
    const result = await this.makeRequest(CONFIG.ENDPOINTS.RECORD, 'GET');
    
    if (result.success) {
      console.log("✅ Connection successful!");
      const name = result.data?.person?.name;
      if (name) {
        console.log(`👤 Name: ${name['given-names']?.value || ''} ${name['family-name']?.value || ''}`);
      }
      return true;
    } else {
      console.log("❌ Connection failed. Check your access token.");
      return false;
    }
  }

  async addEmployment(employmentData) {
    // Format for ORCID API v3.0
    const orcidFormat = {
      "department-name": employmentData.department || "",
      "role-title": employmentData.role,
      "start-date": employmentData.start_date,
      "end-date": employmentData.end_date || null,
      "organization": {
        "name": employmentData.organization.name,
        "address": {
          "city": employmentData.organization.address.city,
          "region": employmentData.organization.address.region,
          "country": employmentData.organization.address.country
        },
        "disambiguated-organization": null
      },
      "url": employmentData.url || null,
      "external-ids": {
        "external-id": []
      },
      "created-date": null,
      "last-modified-date": null,
      "source": null,
      "put-code": null,
      "path": null,
      "display-index": null
    };

    return await this.makeRequest(CONFIG.ENDPOINTS.EMPLOYMENT, 'POST', orcidFormat);
  }

  async addEducation(educationData) {
    // Similar formatting for education
    const orcidFormat = {
      "department-name": educationData.department || "",
      "role-title": educationData.role,
      "start-date": educationData.start_date,
      "end-date": educationData.end_date || null,
      "organization": {
        "name": educationData.organization.name,
        "address": {
          "city": educationData.organization.address.city,
          "region": educationData.organization.address.region,
          "country": educationData.organization.address.country
        },
        "disambiguated-organization": null
      },
      "url": educationData.url || null,
      "external-ids": {
        "external-id": []
      },
      "created-date": null,
      "last-modified-date": null,
      "source": null,
      "put-code": null,
      "path": null,
      "display-index": null
    };

    return await this.makeRequest(CONFIG.ENDPOINTS.EDUCATION, 'POST', orcidFormat);
  }

  async addWork(workData) {
    // Format for work with DOI
    const orcidFormat = {
      "title": {
        "title": {
          "value": workData.title
        },
        "subtitle": null,
        "translated-title": null
      },
      "journal-title": {
        "value": workData.journal
      },
      "short-description": null,
      "citation": workData.citation_type === "bibtex" ? {
        "citation-type": "bibtex",
        "citation-value": workData.citation_value
      } : null,
      "type": workData.type || "journal-article",
      "publication-date": {
        "year": {
          "value": workData.year
        },
        "month": null,
        "day": null
      },
      "external-ids": {
        "external-id": [
          {
            "external-id-type": "doi",
            "external-id-value": workData.doi,
            "external-id-url": {
              "value": `https://doi.org/${workData.doi}`
            },
            "external-id-relationship": "self"
          }
        ]
      },
      "url": {
        "value": `https://doi.org/${workData.doi}`
      },
      "contributors": {
        "contributor": []
      },
      "language-code": null,
      "country": null,
      "visibility": "public"
    };

    return await this.makeRequest(CONFIG.ENDPOINTS.WORK, 'POST', orcidFormat);
  }

  async runBatchImport() {
    console.log("🚀 Starting ORCID Batch Import");
    console.log(`📊 ORCID: ${CONFIG.ORCID_ID}`);
    console.log("=".repeat(50));

    // Load data
    const dataPath = path.join(__dirname, CONFIG.DATA_FILE);
    if (!fs.existsSync(dataPath)) {
      console.error(`❌ Data file not found: ${CONFIG.DATA_FILE}`);
      console.log("Run this script in the same directory as orcid-profile-data.json");
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`📁 Loaded data: ${data.employment.length} employments, ${data.education.length} educations, ${data.works.length} works`);

    // Test connection first
    const connected = await this.testConnection();
    if (!connected) {
      process.exit(1);
    }

    console.log("\n📤 Starting batch import...");
    const results = {
      employment: { success: 0, failed: 0, details: [] },
      education: { success: 0, failed: 0, details: [] },
      works: { success: 0, failed: 0, details: [] }
    };

    // Add employments
    if (data.employment && data.employment.length > 0) {
      console.log(`\n💼 Adding ${data.employment.length} employment records...`);
      for (const emp of data.employment) {
        const result = await this.addEmployment(emp);
        if (result.success) {
          console.log(`  ✅ ${emp.organization.name} - ${emp.role}`);
          results.employment.success++;
          results.employment.details.push({ org: emp.organization.name, success: true });
        } else {
          console.log(`  ❌ ${emp.organization.name} - ${result.error.substring(0, 50)}`);
          results.employment.failed++;
          results.employment.details.push({ org: emp.organization.name, success: false, error: result.error });
        }
        await this.delay(500); // Rate limiting
      }
    }

    // Add educations
    if (data.education && data.education.length > 0) {
      console.log(`\n🎓 Adding ${data.education.length} education records...`);
      for (const edu of data.education) {
        const result = await this.addEducation(edu);
        if (result.success) {
          console.log(`  ✅ ${edu.organization.name} - ${edu.role}`);
          results.education.success++;
          results.education.details.push({ org: edu.organization.name, success: true });
        } else {
          console.log(`  ❌ ${edu.organization.name} - ${result.error.substring(0, 50)}`);
          results.education.failed++;
          results.education.details.push({ org: edu.organization.name, success: false, error: result.error });
        }
        await this.delay(500);
      }
    }

    // Add works
    if (data.works && data.works.length > 0) {
      console.log(`\n📚 Adding ${data.works.length} work records...`);
      for (const work of data.works) {
        const result = await this.addWork(work);
        if (result.success) {
          console.log(`  ✅ ${work.title.substring(0, 50)}...`);
          results.works.success++;
          results.works.details.push({ title: work.title, success: true });
        } else {
          console.log(`  ❌ ${work.title.substring(0, 50)}... - ${result.error.substring(0, 50)}`);
          results.works.failed++;
          results.works.details.push({ title: work.title, success: false, error: result.error });
        }
        await this.delay(500);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 IMPORT SUMMARY:");
    console.log(`💼 Employment: ${results.employment.success} ✓ / ${results.employment.failed} ✗`);
    console.log(`🎓 Education: ${results.education.success} ✓ / ${results.education.failed} ✗`);
    console.log(`📚 Works: ${results.works.success} ✓ / ${results.works.failed} ✗`);
    console.log(`\n👁️ View your updated profile:`);
    console.log(`🔗 https://orcid.org/${CONFIG.ORCID_ID}`);

    return results;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Quick ORCID Upload Script
=========================

Usage:
  node quick-orcid-upload.js [options]

Options:
  --token <token>    Set ORCID access token directly
  --test             Test connection only
  --help             Show this help

Examples:
  node quick-orcid-upload.js --token YOUR_TOKEN
  ORCID_TOKEN=your_token node quick-orcid-upload.js
  node quick-orcid-upload.js --test

Environment Variables:
  ORCID_TOKEN        Your ORCID OAuth access token
    `);
    return;
  }

  // Check for token in arguments
  const tokenIndex = args.indexOf('--token');
  if (tokenIndex !== -1 && args[tokenIndex + 1]) {
    CONFIG.ACCESS_TOKEN = args[tokenIndex + 1];
  }

  const uploader = new QuickORCIDUploader();
  
  if (args.includes('--test')) {
    await uploader.testConnection();
  } else {
    await uploader.runBatchImport();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = QuickORCIDUploader;