from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: str
    avatar: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user: User
    token: str

class Estate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    status: str
    image: str
    size: Optional[str] = None
    maintenanceAlerts: Optional[int] = 0
    lastVisit: Optional[str] = None

class Staff(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    status: str
    estate: Optional[str] = None
    contact: Optional[str] = None
    avatar: Optional[str] = None

class Vendor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    rating: float
    description: str
    contact: Optional[str] = None
    services: Optional[List[str]] = []

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    date: str
    type: str
    estate: Optional[str] = None
    description: Optional[str] = None

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user: str
    to_user: str
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AISuggestionRequest(BaseModel):
    context: str

class AICommandRequest(BaseModel):
    command: str

# Mock data initialization
async def seed_data():
    if await db.users.count_documents({}) == 0:
        mock_users = [
            {"id": "1", "email": "client@neapolitan.com", "name": "Alexander Sterling", "role": "Client", "avatar": "https://i.pravatar.cc/150?img=12"},
            {"id": "2", "email": "director@neapolitan.com", "name": "Victoria Chen", "role": "Estate Director", "avatar": "https://i.pravatar.cc/150?img=5"},
            {"id": "3", "email": "staff@neapolitan.com", "name": "James Morrison", "role": "Staff", "avatar": "https://i.pravatar.cc/150?img=8"}
        ]
        await db.users.insert_many(mock_users)
    
    if await db.estates.count_documents({}) == 0:
        mock_estates = [
            {"id": "1", "name": "Villa Serenissima", "location": "Lake Como, Italy", "status": "occupied", "image": "https://images.pexels.com/photos/13620067/pexels-photo-13620067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "size": "12,500 sq ft", "maintenanceAlerts": 2, "lastVisit": "2026-01-15"},
            {"id": "2", "name": "Château Lumière", "location": "Provence, France", "status": "preparing", "image": "https://images.unsplash.com/photo-1758612853656-def5033bccb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBtb2Rlcm4lMjBtYW5zaW9uJTIwZXh0ZXJpb3J8ZW58MHx8fHwxNzc1MjU0OTM4fDA&ixlib=rb-4.1.0&q=85", "size": "18,000 sq ft", "maintenanceAlerts": 0, "lastVisit": "2025-12-20"},
            {"id": "3", "name": "Penthouse Azure", "location": "Manhattan, New York", "status": "vacant", "image": "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "size": "8,200 sq ft", "maintenanceAlerts": 1, "lastVisit": "2025-11-05"}
        ]
        await db.estates.insert_many(mock_estates)
    
    if await db.staff.count_documents({}) == 0:
        mock_staff = [
            {"id": "1", "name": "Jean-Pierre Dubois", "role": "Executive Chef", "status": "on-duty", "estate": "Villa Serenissima", "contact": "+39 340 123 4567", "avatar": "https://i.pravatar.cc/150?img=33"},
            {"id": "2", "name": "Elena Rodriguez", "role": "House Manager", "status": "on-duty", "estate": "Château Lumière", "contact": "+33 6 12 34 56 78", "avatar": "https://i.pravatar.cc/150?img=47"},
            {"id": "3", "name": "Marcus Williams", "role": "Head of Security", "status": "on-duty", "estate": "Villa Serenissima", "contact": "+39 340 987 6543", "avatar": "https://i.pravatar.cc/150?img=52"},
            {"id": "4", "name": "Sophie Laurent", "role": "Private Butler", "status": "off-duty", "estate": "Penthouse Azure", "contact": "+1 212 555 0123", "avatar": "https://i.pravatar.cc/150?img=28"}
        ]
        await db.staff.insert_many(mock_staff)
    
    if await db.vendors.count_documents({}) == 0:
        mock_vendors = [
            {"id": "1", "name": "Prestige Maintenance Group", "category": "Maintenance", "rating": 4.9, "description": "Elite property maintenance and restoration services", "contact": "+1 800 PRESTIGE", "services": ["HVAC", "Plumbing", "Electrical", "Landscaping"]},
            {"id": "2", "name": "Guardian Security Elite", "category": "Security", "rating": 5.0, "description": "Discreet executive protection and estate security", "contact": "+1 800 GUARDIAN", "services": ["24/7 Monitoring", "Personal Security", "Cyber Security"]},
            {"id": "3", "name": "Atelier Events", "category": "Events", "rating": 4.8, "description": "Bespoke event planning and concierge services", "contact": "+33 1 45 67 89 00", "services": ["Event Planning", "Catering", "Entertainment"]},
            {"id": "4", "name": "Saveur Privé Catering", "category": "Hospitality", "rating": 4.9, "description": "Michelin-star private dining experiences", "contact": "+39 02 1234 5678", "services": ["Private Chef", "Wine Pairing", "Menu Design"]}
        ]
        await db.vendors.insert_many(mock_vendors)
    
    if await db.events.count_documents({}) == 0:
        mock_events = [
            {"id": "1", "title": "Villa Serenissima Guest Arrival", "date": "2026-02-10", "type": "guest", "estate": "Villa Serenissima", "description": "Mr. & Mrs. Chen arriving for weekend stay"},
            {"id": "2", "title": "Annual Charity Gala", "date": "2026-03-15", "type": "event", "estate": "Château Lumière", "description": "Hosting 80 guests for foundation fundraiser"},
            {"id": "3", "title": "Aspen Winter Retreat", "date": "2026-01-28", "type": "travel", "description": "Week-long stay at private chalet"}
        ]
        await db.events.insert_many(mock_events)

# Routes
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    user_doc = await db.users.find_one({"email": req.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return LoginResponse(
        user=User(**user_doc),
        token=f"mock_token_{user_doc['id']}"
    )

@api_router.get("/auth/me", response_model=User)
async def get_current_user():
    user_doc = await db.users.find_one({"email": "client@neapolitan.com"}, {"_id": 0})
    return User(**user_doc)

@api_router.get("/estates", response_model=List[Estate])
async def get_estates():
    estates = await db.estates.find({}, {"_id": 0}).to_list(100)
    return [Estate(**e) for e in estates]

@api_router.get("/estates/{estate_id}", response_model=Estate)
async def get_estate(estate_id: str):
    estate = await db.estates.find_one({"id": estate_id}, {"_id": 0})
    if not estate:
        raise HTTPException(status_code=404, detail="Estate not found")
    return Estate(**estate)

@api_router.get("/staff", response_model=List[Staff])
async def get_staff():
    staff = await db.staff.find({}, {"_id": 0}).to_list(100)
    return [Staff(**s) for s in staff]

@api_router.get("/vendors", response_model=List[Vendor])
async def get_vendors():
    vendors = await db.vendors.find({}, {"_id": 0}).to_list(100)
    return [Vendor(**v) for v in vendors]

@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(100)
    return [Event(**e) for e in events]

@api_router.get("/messages", response_model=List[Message])
async def get_messages():
    messages = await db.messages.find({}, {"_id": 0}).to_list(100)
    return [Message(**m) for m in messages]

@api_router.post("/messages", response_model=Message)
async def send_message(msg: Message):
    doc = msg.model_dump()
    await db.messages.insert_one(doc)
    return msg

@api_router.post("/ai/suggest")
async def ai_suggest(req: AISuggestionRequest):
    try:
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=f"suggest_{uuid.uuid4()}",
            system_message="You are Neapolitan Intelligence, an ultra-discreet AI assistant for ultra-high-net-worth individuals. Provide brief, elegant suggestions for estate management, staff coordination, and lifestyle optimization. Be concise and sophisticated."
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=f"Based on this context: {req.context}. Provide 2-3 smart, actionable suggestions.")
        response = await chat.send_message(user_message)
        
        return {"suggestions": response}
    except Exception as e:
        logging.error(f"AI suggest error: {e}")
        return {"suggestions": "Optimize estate staffing levels based on seasonal occupancy patterns."}

@api_router.post("/ai/command")
async def ai_command(req: AICommandRequest):
    try:
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=f"command_{uuid.uuid4()}",
            system_message="You are Neapolitan Intelligence. Process natural language commands for estate management. Interpret user intent and provide structured responses. Be ultra-brief and precise."
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=f"Command: {req.command}. Interpret and respond with action confirmation.")
        response = await chat.send_message(user_message)
        
        return {"response": response, "action": "processed"}
    except Exception as e:
        logging.error(f"AI command error: {e}")
        return {"response": "Command acknowledged. Processing request.", "action": "processed"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    await seed_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()