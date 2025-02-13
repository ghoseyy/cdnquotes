const categories = [
    'englishasset', 'hindi', 'urdu', 'Nepali', 'Love',
    'Inspiration', 'Motivation', 'Wisdom', 'Life'
  ];
  
  async function testRandomness(baseUrl, category, numTests = 10) {
    console.log(`\nTesting category: ${category}`);
    console.log('-'.repeat(50));
    
    const results = new Set();
    const responses = [];
    
    for (let i = 0; i < numTests; i++) {
      try {
        const response = await fetch(`${baseUrl}/api/randomImage?category=${category}`);
        const data = await response.json();
        
        if (data.error) {
          console.error(`Error for ${category}:`, data.error);
          continue;
        }
        
        results.add(data.url);
        responses.push(data.url);
        console.log(`Test ${i + 1}: ${data.url}`);
      } catch (error) {
        console.error(`Failed to fetch for ${category}:`, error.message);
      }
    }
    
    // Calculate uniqueness percentage
    const uniquePercentage = (results.size / numTests) * 100;
    console.log('\nResults:');
    console.log(`Total requests: ${numTests}`);
    console.log(`Unique images: ${results.size}`);
    console.log(`Uniqueness percentage: ${uniquePercentage.toFixed(2)}%`);
    
    return {
      category,
      totalRequests: numTests,
      uniqueImages: results.size,
      uniquePercentage
    };
  }
  
  async function testAllCategories() {
    const baseUrl = 'https://cdnquotes.vercel.app';
    const results = [];
    
    console.log('Starting randomness test for all categories...\n');
    
    for (const category of categories) {
      const result = await testRandomness(baseUrl, category);
      results.push(result);
    }
    
    console.log('\nSummary for all categories:');
    console.log('='.repeat(60));
    results.forEach(result => {
      console.log(`${result.category}:`);
      console.log(`  Unique images: ${result.uniqueImages}/${result.totalRequests}`);
      console.log(`  Uniqueness: ${result.uniquePercentage.toFixed(2)}%`);
    });
  }
  
  // Run the tests
  testAllCategories();