const API_URL = 'http://localhost:5173/api';

async function testEndpoint(method: string, url: string, description: string, expectedStatus: number = 401) {
    try {
        console.log(`Testing ${description} (${method} ${url})...`);
        const response = await fetch(`${API_URL}${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === expectedStatus) {
            console.log(`✅ PASS: Got ${response.status} as expected.`);
        } else {
            console.error(`❌ FAIL: Expected ${expectedStatus}, got ${response.status}`);
        }
    } catch (error: any) {
        console.error(`❌ ERROR: ${error.message}`);
    }
}

async function runTests() {
    console.log('Starting Security Verification...\n');

    // Students
    await testEndpoint('GET', '/students', 'List Students (Unauthenticated)');
    await testEndpoint('POST', '/students', 'Create Student (Unauthenticated)');
    await testEndpoint('PUT', '/students/123', 'Update Student (Unauthenticated)');
    await testEndpoint('DELETE', '/students/123', 'Delete Student (Unauthenticated)');

    // Upload
    await testEndpoint('POST', '/upload/image', 'Upload Image (Unauthenticated)');
    await testEndpoint('DELETE', '/upload/image/123', 'Delete Image (Unauthenticated)');

    // Senseis
    await testEndpoint('POST', '/senseis', 'Create Sensei (Unauthenticated)');
    await testEndpoint('PUT', '/senseis/123', 'Update Sensei (Unauthenticated)');
    await testEndpoint('DELETE', '/senseis/123', 'Delete Sensei (Unauthenticated)');
    await testEndpoint('PUT', '/senseis/reorder', 'Reorder Senseis (Unauthenticated)');

    // Locations
    await testEndpoint('POST', '/locations', 'Create Location (Unauthenticated)');
    await testEndpoint('PUT', '/locations/123', 'Update Location (Unauthenticated)');
    await testEndpoint('DELETE', '/locations/123', 'Delete Location (Unauthenticated)');
    await testEndpoint('PUT', '/locations/reorder', 'Reorder Locations (Unauthenticated)');
    await testEndpoint('POST', '/locations/123/images', 'Add Location Image (Unauthenticated)');
    await testEndpoint('DELETE', '/locations/123/images/0', 'Delete Location Image (Unauthenticated)');

    console.log('\nVerification Complete.');
}

runTests();
