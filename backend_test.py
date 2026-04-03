import requests
import sys
import json
from datetime import datetime

class NeapolitanConciergeAPITester:
    def __init__(self, base_url="https://concierge-command-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if success and response.content:
                try:
                    response_data = response.json()
                    details += f", Response: {json.dumps(response_data, indent=2)[:200]}..."
                except:
                    details += f", Response: {response.text[:100]}..."
            elif not success:
                details += f", Expected: {expected_status}, Error: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication...")
        
        # Test client login
        success, response = self.run_test(
            "Client Login",
            "POST",
            "auth/login",
            200,
            data={"email": "client@neapolitan.com", "password": "password"}
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.log_test("Token Retrieved", True, f"Token: {self.token[:20]}...")
        else:
            self.log_test("Token Retrieved", False, "No token in response")
            return False

        # Test director login
        self.run_test(
            "Director Login",
            "POST",
            "auth/login",
            200,
            data={"email": "director@neapolitan.com", "password": "password"}
        )

        # Test invalid login
        self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrong"}
        )

        # Test get current user
        self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )

        return True

    def test_estates_api(self):
        """Test estates endpoints"""
        print("\n🏠 Testing Estates API...")
        
        # Get all estates
        success, estates = self.run_test(
            "Get All Estates",
            "GET",
            "estates",
            200
        )
        
        if success and estates:
            estate_id = estates[0]['id'] if estates else None
            if estate_id:
                # Get specific estate
                self.run_test(
                    "Get Estate by ID",
                    "GET",
                    f"estates/{estate_id}",
                    200
                )
            else:
                self.log_test("Get Estate by ID", False, "No estates found to test")
        
        # Test non-existent estate
        self.run_test(
            "Get Non-existent Estate",
            "GET",
            "estates/non-existent-id",
            404
        )

    def test_staff_api(self):
        """Test staff endpoints"""
        print("\n👥 Testing Staff API...")
        
        self.run_test(
            "Get All Staff",
            "GET",
            "staff",
            200
        )

    def test_vendors_api(self):
        """Test vendors endpoints"""
        print("\n🏢 Testing Vendors API...")
        
        self.run_test(
            "Get All Vendors",
            "GET",
            "vendors",
            200
        )

    def test_events_api(self):
        """Test events endpoints"""
        print("\n📅 Testing Events API...")
        
        self.run_test(
            "Get All Events",
            "GET",
            "events",
            200
        )

    def test_messaging_api(self):
        """Test messaging endpoints"""
        print("\n💬 Testing Messaging API...")
        
        # Get messages
        self.run_test(
            "Get Messages",
            "GET",
            "messages",
            200
        )
        
        # Send message
        test_message = {
            "from_user": "client@neapolitan.com",
            "to_user": "director@neapolitan.com",
            "content": "Test message from API testing"
        }
        
        self.run_test(
            "Send Message",
            "POST",
            "messages",
            200,
            data=test_message
        )

    def test_ai_features(self):
        """Test AI endpoints"""
        print("\n🤖 Testing AI Features...")
        
        # Test AI suggestions
        self.run_test(
            "AI Suggestions",
            "POST",
            "ai/suggest",
            200,
            data={"context": "3 estates, 2 staff on duty, 1 upcoming event"}
        )
        
        # Test AI commands
        self.run_test(
            "AI Commands",
            "POST",
            "ai/command",
            200,
            data={"command": "Schedule maintenance for Villa Serenissima"}
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Neapolitan Concierge API Testing...")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test authentication first
        if not self.test_authentication():
            print("❌ Authentication failed, stopping tests")
            return False
        
        # Test all other endpoints
        self.test_estates_api()
        self.test_staff_api()
        self.test_vendors_api()
        self.test_events_api()
        self.test_messaging_api()
        self.test_ai_features()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check details above.")
            return False

def main():
    tester = NeapolitanConciergeAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())