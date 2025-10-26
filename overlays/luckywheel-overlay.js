"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const client_1 = require("react-dom/client");
const LuckyWheelOverlay_1 = __importDefault(require("../components/LuckyWheelOverlay"));
// Actions will be fetched from the overlay server
function LuckyWheelOverlayRealtime() {
    const overlayRef = (0, react_1.useRef)(null);
    const [config, setConfig] = react_1.default.useState(null);
    const [actions, setActions] = react_1.default.useState([]);
    // Determine which instance this overlay is for based on URL
    const isWheel2 = typeof window !== 'undefined' && window.location.pathname.includes('luckywheel2-overlay');
    const instanceKey = isWheel2 ? 'luckywheel2' : 'luckywheel';
    const wsUrl = `ws://localhost:3002/ws/ws/${isWheel2 ? 'luckywheel2' : 'luckywheel'}`;
    // Fetch actions from overlay server
    const fetchActions = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/actions');
            const data = await response.json();
            if (data.success && Array.isArray(data.actions)) {
                setActions(data.actions);
                console.log(`[LuckyWheelOverlay] Loaded ${data.actions.length} actions from server`);
            }
        }
        catch (e) {
            console.error('[LuckyWheelOverlay] Failed to fetch actions:', e);
        }
    };
    (0, react_1.useEffect)(() => {
        // Fetch actions on mount
        fetchActions();
        const ws = new window.WebSocket(wsUrl);
        ws.onopen = () => {
            console.log(`[LuckyWheelOverlay] Connected to ${wsUrl}`);
        };
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Config updates
                if ((!isWheel2 && data.type === 'wheel-config-update') || (isWheel2 && data.type === 'wheel2-config-update')) {
                    setConfig(data.config);
                    // Spin events
                }
                else if ((!isWheel2 && data.type === 'wheel-spin') || (isWheel2 && data.type === 'wheel2-spin')) {
                    if (overlayRef.current && typeof overlayRef.current.startSpin === 'function') {
                        overlayRef.current.startSpin({ shuffledBoxes: data.shuffledBoxes, winnerIdx: data.winnerIdx });
                    }
                }
                else if (data.type === 'actions-updated') {
                    console.log('[LuckyWheelOverlay] Actions updated via WebSocket, refreshing action list');
                    setActions(data.actions);
                }
            }
            catch (e) {
                console.error('[LuckyWheelOverlay] Failed to parse WS message:', event.data);
            }
        };
        return () => ws.close();
    }, [wsUrl, isWheel2]);
    return ((0, jsx_runtime_1.jsx)(LuckyWheelOverlay_1.default, { actions: actions, minimal: true, ref: overlayRef, externalConfig: config, instanceKey: isWheel2 ? 'luckywheel2' : 'luckywheel', onTriggerAction: (action) => {
            if (action && action.id) {
                const hasFull = action && action.name;
                const payload = hasFull ? { action } : { actionId: action.id };
                fetch('http://localhost:3002/api/execute-action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true,
                }).catch(() => { });
            }
        } }));
}
(0, client_1.createRoot)(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(LuckyWheelOverlayRealtime, {}));
