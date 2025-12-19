import React from 'react';
import { useHospitalStore, Bed } from '@/stores/useHospitalStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    BedDouble,
    AlertTriangle,
    CheckCircle,
    Clock,
    Wrench,
    TrendingUp,
    Users
} from 'lucide-react';

interface BedDashboardProps {
    compact?: boolean;
}

export const BedDashboard: React.FC<BedDashboardProps> = ({ compact = false }) => {
    const beds = useHospitalStore((state) => state.beds);
    const updateBedStatus = useHospitalStore((state) => state.updateBedStatus);

    // Calculate stats
    const stats = {
        total: beds.length,
        available: beds.filter(b => b.status === 'available').length,
        occupied: beds.filter(b => b.status === 'occupied').length,
        cleaning: beds.filter(b => b.status === 'cleaning').length,
        maintenance: beds.filter(b => b.status === 'maintenance').length,
    };

    const occupancyRate = Math.round((stats.occupied / stats.total) * 100);
    const criticalThreshold = 85;
    const warningThreshold = 70;

    // Get status style
    const getStatusStyle = (status: Bed['status']) => {
        switch (status) {
            case 'available':
                return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Disponible' };
            case 'occupied':
                return { icon: Users, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Occupé' };
            case 'cleaning':
                return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Nettoyage' };
            case 'maintenance':
                return { icon: Wrench, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30', label: 'Maintenance' };
        }
    };

    // Handle status transitions
    const handleStatusChange = (bedId: string, newStatus: Bed['status']) => {
        updateBedStatus(bedId, newStatus, newStatus === 'available' ? null : undefined);
    };

    if (compact) {
        return (
            <Card className="glass-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BedDouble className="h-4 w-4" />
                        Occupation des Lits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Progress
                                value={occupancyRate}
                                className={`h-3 ${occupancyRate >= criticalThreshold ? 'bg-red-200' : occupancyRate >= warningThreshold ? 'bg-yellow-200' : 'bg-green-200'}`}
                            />
                        </div>
                        <span className={`text-lg font-bold ${occupancyRate >= criticalThreshold ? 'text-red-500' : occupancyRate >= warningThreshold ? 'text-yellow-500' : 'text-green-500'}`}>
                            {occupancyRate}%
                        </span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{stats.available} disponibles</span>
                        <span>{stats.occupied} occupés</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-500">{stats.available}</div>
                        <div className="text-xs text-muted-foreground">Disponibles</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-500">{stats.occupied}</div>
                        <div className="text-xs text-muted-foreground">Occupés</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-500">{stats.cleaning}</div>
                        <div className="text-xs text-muted-foreground">Nettoyage</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className={`text-2xl font-bold ${occupancyRate >= criticalThreshold ? 'text-red-500' : occupancyRate >= warningThreshold ? 'text-yellow-500' : 'text-green-500'}`}>
                            {occupancyRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Taux d'occupation</div>
                    </CardContent>
                </Card>
            </div>

            {/* Alert if high occupancy */}
            {occupancyRate >= warningThreshold && (
                <Card className={`border-2 ${occupancyRate >= criticalThreshold ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className={`h-6 w-6 ${occupancyRate >= criticalThreshold ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                            <div className="font-semibold">
                                {occupancyRate >= criticalThreshold ? 'Alerte Critique' : 'Attention'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {occupancyRate >= criticalThreshold
                                    ? 'Capacité critique atteinte. Préparez des solutions alternatives.'
                                    : 'Taux d\'occupation élevé. Surveillez les admissions.'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bed Grid */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BedDouble className="h-5 w-5" />
                        Vue des Lits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {beds.map((bed) => {
                            const style = getStatusStyle(bed.status);
                            const StatusIcon = style.icon;

                            return (
                                <div
                                    key={bed.id}
                                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${style.bg}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sm">{bed.number}</span>
                                        <StatusIcon className={`h-4 w-4 ${style.color}`} />
                                    </div>

                                    {bed.patient ? (
                                        <div className="text-xs">
                                            <div className="font-medium truncate">{bed.patient.name}</div>
                                            <div className="text-muted-foreground truncate">{bed.patient.condition}</div>
                                        </div>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px]">
                                            {style.label}
                                        </Badge>
                                    )}

                                    {/* Quick action buttons */}
                                    {bed.status === 'cleaning' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-full mt-2 h-6 text-xs"
                                            onClick={() => handleStatusChange(bed.id, 'available')}
                                        >
                                            Marquer Prêt
                                        </Button>
                                    )}
                                    {bed.status === 'occupied' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-full mt-2 h-6 text-xs"
                                            onClick={() => handleStatusChange(bed.id, 'cleaning')}
                                        >
                                            Libérer
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BedDashboard;
