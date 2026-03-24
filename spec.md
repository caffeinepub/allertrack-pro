# AllerTrack Pro

## Current State
Fully functional lab sample tracking app with:
- Sidebar with generated UML logo placeholder
- Dashboard with stats
- Sample creation (patient info + test selection)
- Sample detail with status/referral/test updates
- Referrals page
- Backend supports: createSample, getSamples, getSampleById, updateSampleStatus, updateSampleReferral, updateTestStatus, deleteSample, addTestToSample
- No edit-sample endpoint exists on backend
- No example/seed data
- No welcome popup
- Branding shows "Developed by Thabzizi | Authorized by Daisy"

## Requested Changes (Diff)

### Add
- Replace sidebar logo with uploaded Ultimate Medical Laboratories logo image: `/assets/uploads/images-019d20b1-f273-77c0-a7b1-6b3517fa9a5b-1.png`
- Welcome/info popup that shows on first visit: brief app description + rotating scientific quotes
- Example sample entries auto-seeded via backend on first app load (stored in localStorage to avoid re-seeding). Use authorizer names Daisy Goche or Charles Gwatumba as handlers.
- `updateSample` backend endpoint to allow editing patient name, sample source, sample type, handler, notes
- Edit mode in SampleDetail page — edit button opens inline form to modify patient info fields, saves via updateSample
- Handler field in NewSample becomes a dropdown with options: "Daisy Goche, MLS" and "Charles Gwatumba, MLS" plus free-text option

### Modify
- Sidebar logo: swap generated AI logo for the real uploaded UML logo
- Branding footer: update to reflect both authorizers
- Sample detail: add Edit button that toggles an editable form for patient fields

### Remove
- Nothing removed

## Implementation Plan
1. Generate new Motoko code with `updateSample` function added
2. Update Sidebar.tsx to use uploaded logo path
3. Create WelcomePopup.tsx component with app description and scientific quotes carousel, shown on first visit (localStorage flag)
4. Add WelcomePopup to App.tsx
5. Create seedData.ts utility that creates 5 example samples with tests on first load using the backend APIs
6. Wire seedData in a useEffect in App.tsx or Dashboard.tsx
7. Update NewSample.tsx: handler field becomes a dropdown with Daisy Goche MLS, Charles Gwatumba MLS, or custom
8. Update SampleDetail.tsx: add edit mode for patient info fields calling updateSample mutation
9. Add useUpdateSample hook to useQueries.ts
