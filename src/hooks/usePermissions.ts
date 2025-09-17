import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Match, PermissionCheck } from '../types';

export const usePermissions = () => {
  const { profile, teamMemberships } = useAuth();

  const permissions = useMemo((): PermissionCheck => {
    // Admins only can edit in the simplified model
    const isAdmin = profile?.role === 'Admin';
    const isScorer = false;

    return {
      canEditMatch: (matchId: string) => {
        return isAdmin;
      },
      canApproveRequests: isAdmin,
      canSetRoles: isAdmin,
      canFinalizeMatch: (matchId: string) => {
        return isAdmin;
      }
    };
  }, [profile]);

  const canEditMatch = (match: Match) => {
    // All signed-in users can edit any match
    return !!profile;
  };

  const canEditMatchStatus = (match: Match) => {
    // Can only edit if match is not final
    return match.status !== 'Final' && canEditMatch(match);
  };

  return {
    ...permissions,
    canEditMatch,
    canEditMatchStatus,
    isAdmin: profile?.role === 'Admin',
    isScorer: false,
    isViewer: !profile
  };
};
