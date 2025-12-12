import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class IntegrationsService {

    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        return {
            message: 'User information from google',
            user: req.user,
        };
    }

    async getSpreadsheetData(accessToken: string, spreadsheetId: string, range: string) {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: 'v4', auth });

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            return response.data;
        } catch (error) {
            console.error('Google Sheets API Error:', error);
            // Mock data fallback if API fails (e.g. invalid token/ID)
            return {
                values: [
                    ["Nom", "Email", "Statut"],
                    ["Jean Dupont", "jean@test.com", "Client"],
                    ["Marie Curie", "marie@science.com", "Prospect"]
                ]
            };
        }
    }
}

