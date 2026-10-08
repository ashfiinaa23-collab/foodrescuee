# Food Rescue — Hackathon MVP

A modern, clean, and elegant web application built for college hackathons to reduce food waste and combat hunger by connecting community surplus food donors with people in need.

**100% Non-AI • Pure HTML, CSS & Vanilla JavaScript • LocalStorage Persistence**

---

## 🚀 Key Features & Flow

The application faithfully implements the 4-step core journey:
$$\text{Donate Surplus Food} \longrightarrow \text{Food Becomes Available} \longrightarrow \text{User Finds Food} \longrightarrow \text{User Claims Food}$$

1. **Home Page (`#home`)**:
   - Impactful hero section with food imagery and live statistics counter.
   - 4-step visual workflow explaining the platform.
   - Featured available food spotlight and community call to action.

2. **Donate Food Page (`#donate`)**:
   - Clean donation form capturing:
     - Food name & dietary category
     - Food type (Cooked Meal, Bakery, Produce, etc.)
     - Quantity / number of meals
     - Pickup location & specific instructions
     - Available until (deadline)
     - Donor name, organization, phone, and email
     - Preset photo selection or custom image URL
   - **Real-Time Live Preview Card**: Updates instantly as the donor fills out the form.
   - Saves directly to browser `localStorage` and immediately redirects to Find Food.

3. **Login Page (`#login`)**:
   - Donor and Recipient account toggle.
   - **One-Click Quick Login buttons** for judges:
     - *Chef Rajesh (Food Donor)*
     - *Maya Lin (Community Recipient)*
   - Updates session badge in header with user avatar and sign-out option.

4. **Find Food Page (`#find`)**:
   - Real-time search bar (by food title, description, or location).
   - Category pill filters (`All`, `Cooked Meal`, `Bakery & Bread`, `Fresh Produce`, `Packaged Food`).
   - Status filter (`All Items`, `Available Only`, `Claimed`).
   - Cards display: image, name, quantity, location, deadline, food type, status badge, and **View Details** button.

5. **Food Details Page (`#details?id=...`)**:
   - Full food photography and dietary specifications.
   - Complete meal description and food safety pledge.
   - Donor card with contact numbers and pickup instructions.
   - **Claim Food Now** button (with status validation to prevent double-claiming).

6. **Claim Confirmation Page (`#claim-confirmation?id=...`)**:
   - Updates item status in `localStorage` from **Available** to **Claimed**.
   - Generates a unique Claim Reference ID (e.g. `CLAIM-849201`).
   - Displays pickup checklist and donor contact card.
   - Print/Save Slip and navigation back to Home or Find Food.

---

## 🎨 Design System & Color Palette

- **Dark Green**: `#164E36`
- **Primary Green**: `#3B8D3A`
- **Light Green**: `#EAF6E8`
- **White**: `#FFFFFF`
- **Soft Gray**: `#F6F7F5`
- **Text**: `#1F2933`

---

## 📁 File Structure

```text
AR/
├── index.html        # Main HTML file with responsive layout and semantic views
├── css/
│   └── style.css     # Design system, variables, components & responsive styling
├── js/
│   ├── data.js       # LocalStorage data store & initial demo food items
│   └── app.js        # Hash-based client router, form handlers & toast system
├── server.js         # Zero-dependency local Node.js static server
└── README.md         # Documentation & Hackathon presentation guide
```

---

## 💻 How to Run

### Option 1: Open Directly in Any Browser (Zero Setup)
Simply double-click [`index.html`](file:///c:/Users/Admin/Desktop/AR/index.html) or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox**.

### Option 2: Run via Node.js Local Server
Run the included lightweight local server:
```bash
node server.js
```
Then open your browser at:
```
http://localhost:3000
```
