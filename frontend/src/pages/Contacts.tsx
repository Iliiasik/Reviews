import { ContactsLayout } from '@widgets/layout/ContactsLayout';
import { Hero } from '@features/contacts/ui/Hero.tsx';
import { Form } from '@features/contacts/ui/Form.tsx';
import { ContactsInfo } from '@features/contacts/ui/ContactsInfo.tsx';

export const Contacts = () => (
    <ContactsLayout>
        <section className="bg-base-100 py-12 px-4 sm:px-8">
            <div className="relative mx-auto max-w-2xl lg:h-[480px]">
                <div className="flex flex-col items-center gap-8 lg:block">
                    <div className="lg:absolute lg:top-0 lg:right-0 lg:translate-x-3 lg:-translate-y-4 z-20">
                        <Hero />
                    </div>
                    <div className="lg:absolute lg:bottom-0 lg:left-0 lg:-translate-x-2 lg:translate-y-4 z-10">
                        <Form />
                    </div>
                </div>
            </div>
        </section>
        <ContactsInfo />
    </ContactsLayout>
);

