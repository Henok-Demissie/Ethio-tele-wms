// Simple test script to verify inventory API functionality
const testInventoryAPI = async () => {
  console.log('🧪 Testing Inventory API...')
  
  try {
    // Test GET request
    console.log('1. Testing GET /api/inventory...')
    const getResponse = await fetch('http://localhost:3000/api/inventory')
    const getData = await getResponse.json()
    console.log('✅ GET successful:', getData.inventoryItems?.length || 0, 'items found')
    
    // Test POST request
    console.log('2. Testing POST /api/inventory...')
    const testData = {
      productId: "cmdxf12u1000a12zanq85gmlx", // Cisco Router
      warehouseId: "cmdxf12sc000512zax4u2o4wz", // Regional Warehouse North
      quantity: 15,
      reservedQty: 3,
      location: "Test-B2"
    }
    
    const postResponse = await fetch('http://localhost:3000/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    const postData = await postResponse.json()
    
    if (postResponse.ok) {
      console.log('✅ POST successful:', postData.message)
      console.log('Created item:', postData.inventoryItem)
    } else {
      console.log('❌ POST failed:', postData.error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testInventoryAPI()
}

module.exports = { testInventoryAPI } 