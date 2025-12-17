import { toast } from "sonner";

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'google' | 'internal';
    source?: string;
}

// Simulated Google Calendar Events
const mockGoogleEvents: CalendarEvent[] = [
    {
        id: 'g-1',
        title: 'Réunion Service (Google)',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 0, 0, 0)),
        type: 'google',
        source: 'Dr. House Calendar'
    },
    {
        id: 'g-2',
        title: 'Déjeuner Pro',
        start: new Date(new Date().setHours(13, 0, 0, 0)),
        end: new Date(new Date().setHours(14, 0, 0, 0)),
        type: 'google',
        source: 'Private'
    }
];

export const GoogleCalendarService = {
    connect: async (): Promise<boolean> => {
        // Simulating OAuth Popup flow
        return new Promise((resolve) => {
            const popup = window.open('', 'Google Login', 'width=500,height=600');
            if (popup) {
                popup.document.write(`
                    <html>
                    <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8f9fa;">
                        <h2 style="color: #444;">Connexion Google</h2>
                        <div style="loader: border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite;"></div>
                        <p>Authentification sécurisée en cours...</p>
                        <script>
                            setTimeout(() => {
                                window.close();
                            }, 1500);
                        </script>
                    </body>
                    </html>
                `);
            }

            setTimeout(() => {
                toast.success("Compte Google connecté avec succès", {
                    description: "Vos événements sont maintenant synchronisés."
                });
                resolve(true);
            }, 1500);
        });
    },

    fetchEvents: async (): Promise<CalendarEvent[]> => {
        // Simulate API latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockGoogleEvents);
            }, 800);
        });
    }
};
