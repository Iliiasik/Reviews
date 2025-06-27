import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@pages/Home';
import { Login } from '@pages/Login';
import { Profile } from '@pages/Profile';
import NotFound from '@pages/NotFound';
import { Register } from "@pages/Register.tsx";
import ConfirmEmail from "@pages/ConfirmEmail.tsx";
import {OrganizationPage} from "@pages/OrganisationPage.tsx";
import {AddReview} from "@pages/AddReview.tsx";
import {MainLayout} from "@widgets/layout/MainLayout.tsx";
import {Specialist} from "@pages/Specialist.tsx";
import {UnverifiedProfileCreation} from "@pages/UnverifiedProfileCreation.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/specialist/:id" element={<Specialist />} />
                    <Route path="/specialist/:id/add-review" element={<AddReview />} />
                    <Route path="/new-unverified" element={<UnverifiedProfileCreation />} />
                    <Route path="/organization/:id" element={<OrganizationPage />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
