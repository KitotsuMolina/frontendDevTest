import type { ProductDetail } from '../api/productDetail'

// Respuesta real del producto ZmGrkLRPXOTpxsU4jjAcv, consultada el 30/09/2026.
export const realProductDetail: ProductDetail = {
  "id": "ZmGrkLRPXOTpxsU4jjAcv",
  "brand": "Acer",
  "model": "Iconia Talk S",
  "price": "170",
  "imgUrl": "https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg",
  "networkTechnology": "GSM / HSPA / LTE",
  "networkSpeed": "HSPA 42.2/11.5 Mbps  LTE Cat4 150/50 Mbps",
  "gprs": "Yes",
  "edge": "Yes",
  "announced": "2016  August",
  "status": "Available. Released 2016  October",
  "dimentions": "191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)",
  "weight": "260",
  "sim": "Dual SIM (Micro-SIM/Nano-SIM)",
  "displayType": "IPS LCD capacitive touchscreen  16M colors",
  "displayResolution": "7.0 inches (~69.8% screen-to-body ratio)",
  "displaySize": "720 x 1280 pixels (~210 ppi pixel density)",
  "os": "Android 6.0 (Marshmallow)",
  "cpu": "Quad-core 1.3 GHz Cortex-A53",
  "chipset": "Mediatek MT8735",
  "gpu": "Mali-T720MP2",
  "externalMemory": "microSD  up to 128 GB (dedicated slot)",
  "internalMemory": [
    "16 GB",
    "32 GB"
  ],
  "ram": "2 GB RAM",
  "primaryCamera": [
    "13 MP",
    "autofocus"
  ],
  "secondaryCmera": [
    "2 MP",
    "720p"
  ],
  "speaker": "Yes",
  "audioJack": "Yes",
  "wlan": [
    "Wi-Fi 802.11 a/b/g/n",
    "Wi-Fi Direct",
    "hotspot"
  ],
  "bluetooth": [
    "4.0",
    "A2DP"
  ],
  "gps": "Yes with A-GPS GLONASS",
  "nfc": "",
  "radio": "FM radio",
  "usb": "microUSB 2.0",
  "sensors": [
    "Accelerometer",
    "proximity"
  ],
  "battery": "Non-removable Li-Ion 3400 mAh battery (12.92 Wh)",
  "colors": [
    "Black"
  ],
  "options": {
    "colors": [
      {
        "code": 1000,
        "name": "Black"
      }
    ],
    "storages": [
      {
        "code": 2000,
        "name": "16 GB"
      },
      {
        "code": 2001,
        "name": "32 GB"
      }
    ]
  }
}

export const demoDetail: ProductDetail = { ...realProductDetail, id: 'demo' }

// Segundo producto real: opciones múltiples y atributos de tipo variable.
export const secondProductDetail: ProductDetail = {
  "id": "cGjFJlmqNPIwU59AOcY8H",
  "brand": "Acer",
  "model": "Liquid Z6 Plus",
  "price": "250",
  "imgUrl": "https://itx-frontend-test.onrender.com/images/cGjFJlmqNPIwU59AOcY8H.jpg",
  "networkTechnology": "GSM / HSPA / LTE",
  "networkSpeed": "HSPA 42.2/5.76 Mbps  LTE Cat4 150/50 Mbps",
  "gprs": "Yes",
  "edge": "Yes",
  "announced": "2016  August",
  "status": "Available. Released 2016  December",
  "dimentions": "153.8 x 75.6 x 8.5 mm (6.06 x 2.98 x 0.33 in)",
  "weight": "169",
  "sim": [
    "Single SIM (Micro-SIM) or Dual SIM (Micro-SIM",
    "dual stand-by)"
  ],
  "displayType": "IPS LCD capacitive touchscreen  16M colors",
  "displayResolution": "5.5 inches (~71.7% screen-to-body ratio)",
  "displaySize": "1080 x 1920 pixels (~401 ppi pixel density)",
  "os": "Android 6.0 (Marshmallow)",
  "cpu": "Octa-core 1.3 GHz Cortex-A53",
  "chipset": "Mediatek MT6753",
  "gpu": "Mali-T720MP3",
  "externalMemory": "microSD  up to 256 GB (uses SIM 2 slot)",
  "internalMemory": [
    "32 GB"
  ],
  "ram": "3 GB RAM",
  "primaryCamera": [
    "13 MP",
    "autofocus",
    "LED flash"
  ],
  "secondaryCmera": "5 MP",
  "speaker": "Yes",
  "audioJack": "Yes",
  "wlan": [
    "Wi-Fi 802.11 b/g/n",
    "Wi-Fi Direct",
    "hotspot"
  ],
  "bluetooth": [
    "4.0",
    "A2DP"
  ],
  "gps": "Yes with A-GPS",
  "nfc": "",
  "radio": "FM radio",
  "usb": "microUSB 2.0",
  "sensors": [
    "Fingerprint (front-mounted)",
    "accelerometer",
    "proximity"
  ],
  "battery": "Removable Li-Po 4080 mAh battery",
  "colors": [
    "Black",
    "White"
  ],
  "options": {
    "colors": [
      {
        "code": 1000,
        "name": "Black"
      },
      {
        "code": 1001,
        "name": "White"
      }
    ],
    "storages": [
      {
        "code": 2000,
        "name": "32 GB"
      }
    ]
  }
}

// Tercer detalle real: wlan/bluetooth de texto y características ausentes.
export const thirdProductDetail: ProductDetail = {
  "id": "8hKbH2UHPM_944nRHYN1n",
  "brand": "Acer",
  "model": "Liquid Z6",
  "price": "120",
  "imgUrl": "https://itx-frontend-test.onrender.com/images/8hKbH2UHPM_944nRHYN1n.jpg",
  "networkTechnology": "GSM / HSPA / LTE",
  "networkSpeed": "HSPA  LTE",
  "gprs": "Yes",
  "edge": "Yes",
  "announced": "2016  August",
  "status": "Available. Released 2016  December",
  "dimentions": "-",
  "weight": "",
  "sim": [
    "Single SIM (Micro-SIM) or Dual SIM (Micro-SIM",
    "dual stand-by)"
  ],
  "displayType": "IPS LCD capacitive touchscreen  16M colors",
  "displayResolution": "5.0 inches",
  "displaySize": "720 x 1280 pixels (~294 ppi pixel density)",
  "os": "Android 6.0 (Marshmallow)",
  "cpu": "Quad-core 1.25 GHz Cortex-A53",
  "chipset": "Mediatek MT6737",
  "gpu": "Mali-T720MP2",
  "externalMemory": "microSD  up to 256 GB",
  "internalMemory": [
    "8 GB"
  ],
  "ram": "1 GB RAM",
  "primaryCamera": [
    "8 MP",
    "autofocus",
    "LED flash"
  ],
  "secondaryCmera": "2 MP",
  "speaker": "Yes",
  "audioJack": "Yes",
  "wlan": "Yes",
  "bluetooth": "Yes",
  "gps": "Yes with A-GPS",
  "nfc": "",
  "radio": "FM radio",
  "usb": "microUSB 2.0",
  "sensors": [
    "Accelerometer",
    "proximity"
  ],
  "battery": "Removable Li-Ion 2000 mAh battery",
  "colors": [
    "Black",
    "White"
  ],
  "options": {
    "colors": [
      {
        "code": 1000,
        "name": "Black"
      },
      {
        "code": 1001,
        "name": "White"
      }
    ],
    "storages": [
      {
        "code": 2000,
        "name": "8 GB"
      }
    ]
  }
}
