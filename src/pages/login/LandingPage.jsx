import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import axios from 'axios';
import newLogo from './new-logo.png';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn20TvjC98ePXmOEQiJySSq2QN2p0QuRg",
  authDomain: "taralets-3adb8.firebaseapp.com",
  projectId: "taralets-3adb8",
  storageBucket: "taralets-3adb8.firebasestorage.app",
  messagingSenderId: "353174524186",
  appId: "1:353174524186:web:45cf6ee4f8878bc0df9ca3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function LandingPage() {
  const [features, setFeatures] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const systemFeatures = [
      { id: 1, title: 'Smart Itinerary Planner', content: 'Plan your trips with ease...', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-teal-500' },
      { id: 2, title: 'Group Travel Made Easy', content: 'Create or join travel groups...', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-cyan-500' },
      { id: 3, title: 'Real-time Location Tracking', content: 'Never lose your way...', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-orange-500' },
      { id: 4, title: 'Emergency Assistance', content: 'Quick access to emergency services...', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500' },
      { id: 5, title: 'Weather Integration', content: 'Get accurate weather forecasts...', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 11h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-yellow-500' },
      { id: 6, title: 'Tour Guide Services', content: 'Connect with certified tour guides...', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 8c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-18c3.866 0 7 3.134 7 7s-3.134 7-7 7-7-3.134-7-7 3.134-7 7-7z', color: 'text-indigo-500' },
    ];
    setFeatures(systemFeatures);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Firebase authentication successful:', firebaseUser.email);

      const userDoc = await axios.get(`http://localhost:8080/api/users?email=${email}`);
      const userData = userDoc.data.find(u => u.email === email);
      console.log('User data from API:', userData);

      if (userData && userData.type === 'admin') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        }));
        console.log('Admin login successful, redirecting to dashboard');
        setShowLoginModal(false);
        navigate('/admin-dashboard');
      } else {
        console.log('User is not an admin:', userData);
        setError('Unauthorized: Not an admin account');
        await auth.signOut();
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 flex items-center">
            <img src={newLogo} alt="TaraG Logo" className="w-10 h-10 mr-2" />
            <span>TaraG</span>
          </div>
          <ul className="hidden md:flex space-x-8">
            <li><Link to="/" className="text-gray-600 hover:text-cyan-500 transition">Home</Link></li>
            <li><Link to="/admin-analytics" className="text-gray-600 hover:text-cyan-500 transition">About</Link></li>
          </ul>
          <button className="md:hidden text-gray-600 hover:text-cyan-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen max-h-[Nich] overflow-hidden bg-gradient-to-br from-cyan-500 to-teal-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Your Ultimate <span className="text-yellow-300">Travel Companion</span></h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8">TaraG revolutionizes group travel with real-time tracking, itinerary planning, and seamless coordination.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-cyan-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
                App Store
              </button>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Features for Seamless Travel</h2>
            <div className="w-24 h-1.5 bg-cyan-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">TaraG combines essential travel tools with innovative group coordination features</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="group rounded-xl overflow-hidden border border-gray-100 hover:border-cyan-200 hover:shadow-xl transition duration-300 p-8">
                <div className={`w-14 h-14 rounded-full ${feature.color.replace('text', 'bg')} bg-opacity-10 flex items-center justify-center mb-6`}>
                  <svg className={`w-7 h-7 ${feature.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How TaraG Works</h2>
            <div className="w-24 h-1.5 bg-cyan-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xl font-bold mr-6">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Create Your Account</h3>
                    <p className="text-gray-600">Sign up as a regular user or apply to become a certified tour guide with our verification system.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xl font-bold mr-6">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Plan Your Journey</h3>
                    <p className="text-gray-600">Create detailed itineraries with stops, routes, and notes. Connect with friends or join existing groups.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xl font-bold mr-6">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Travel Together</h3>
                    <p className="text-gray-600">Track group members in real-time, split expenses automatically, and stay safe with emergency features.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Group using TaraG app" 
                className="w-full h-auto rounded-2xl shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Built With Modern Technology</h2>
            <div className="w-24 h-1.5 bg-cyan-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">TaraG leverages cutting-edge technologies to deliver a seamless experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png" alt="React Native" className="h-12" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">React Native</h3>
              <p className="text-gray-600">Cross-platform mobile development</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <img src="https://brandlogos.net/wp-content/uploads/2025/03/firebase_icon-logo_brandlogos.net_tcvck.png" alt="Firebase" className="h-12" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Firebase</h3>
              <p className="text-gray-600">Authentication & Database</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png" alt="Node.js" className="h-12" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Node.js</h3>
              <p className="text-gray-600">Backend Services</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp2V9YM_yYPC4gVs1zWieEWElRfjfFcLYa3A&s" alt="OpenStreetMap" className="h-12" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">OpenStreetMap</h3>
              <p className="text-gray-600">Maps & Navigation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-teal-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join TaraG Today</h2>
          <p className="text-teal-100 text-xl mb-8 max-w-2xl mx-auto">Experience seamless group travel with TaraG's powerful features.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admin-analytics" className="bg-white text-cyan-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              View Feedbacks
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center cursor-pointer" onClick={() => setShowLoginModal(true)}>
                <img src={newLogo} alt="TaraG Logo" className="w-10 h-10 mr-2 borde rounded-lg" />
                <span>TaraG</span>
              </h3>
              <p className="text-gray-400">The ultimate travel companion app for group coordination and safety.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gray-300">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/admin-analytics" className="text-gray-400 hover:text-white transition">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gray-300">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gray-300">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>Â© {new Date().getFullYear()} TaraG. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <img 
            src={newLogo} 
            alt="TaraG Logo" 
            className="w-10 h-10 rounded-lg mr-3"
          />
         
                <div>
                  <h2 className="text-xl font-bold text-gray-900">TaraG</h2>
                  <p className="text-xs text-gray-500">Administrator Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)} 
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                    placeholder="Enter your email"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                    placeholder="Enter your password"
                    required 
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowLoginModal(false)} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;