import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@pages/Home';
import { Login } from '@pages/Login';
import { Profile } from '@pages/Profile';
import NotFound from '@pages/NotFound';
import { Register } from "@pages/Register.tsx";
import ConfirmEmail from "@pages/ConfirmEmail.tsx";
import {SpecialistProfile} from "@pages/SpecialistProfile.tsx";
import {OrganizationProfile} from "@pages/OrganisationProfile.tsx";
import {AddReviewPage} from "@pages/AddReviewPage.tsx";
import {CreateUnverifiedPage} from "@pages/CreateUnverifiedPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/specialist/:id" element={<SpecialistProfile />} />
                <Route path="/organization/:id" element={<OrganizationProfile />} />
                <Route path="/specialist/:id/add-review" element={<AddReviewPage />} />
                <Route path="/new-unverified" element={<CreateUnverifiedPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
