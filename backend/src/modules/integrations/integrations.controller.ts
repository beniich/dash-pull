import { Controller, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationsService } from './integrations.service';
import { Response } from 'express';

@Controller('integrations')
export class IntegrationsController {
    constructor(private readonly integrationsService: IntegrationsService) { }

    @Get('auth/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('auth/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const data = this.integrationsService.googleLogin(req);
        // Redirect to frontend with token
        // In a real app, send a proper session token or cookie
        const token = req.user.accessToken;
        // Note: Assuming frontend runs on port 8082 as seen previously, adjust if needed
        res.redirect(`http://localhost:8082/spreadsheet?google_token=${token}`);
    }

    @Get('google/sheets')
    async getSheet(
        @Query('token') token: string,
        @Query('spreadsheetId') spreadsheetId: string,
        @Query('range') range: string
    ) {
        // Default to a mock ID if not provided, though the service handles errors
        const id = spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
        const rng = range || 'Class Data!A1:E';
        return this.integrationsService.getSpreadsheetData(token, id, rng);
    }
}
