import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Organization } from '@customTypes/organization';
import { organizationQuery } from '@services/organization';
import { useRequest } from '@hooks/useRequest';
import { useRouter } from 'next/router';
import { AxiosRequestConfig } from 'axios';

interface Props {
  children: ReactNode;
}

interface IOrganizationContext {
  currentOrganization: Organization | null;
  currentOrganizations: Organization[];
  setCurrentOrganizations: (organizations: Organization[]) => void;
  organizationList: Organization[];
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(undefined);

export function OrganizationProvider({ children }: Props) {
  const router = useRouter();

  const [currentOrganizations, setCurrentOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [requestConfig, setRequestConfig] = useState<AxiosRequestConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await organizationQuery.getAllOrganization();
        setRequestConfig(config);
      } catch (error) {
        console.error("Failed to fetch the organization config:", error);
      }
    };

    fetchConfig();
  }, []);

  const { data, error } = useRequest<any>(requestConfig);

  const organizationList = data?.results || [];

  useEffect(() => {
    console.log('Data from API:', data);
    console.log('API Error:', error);

    if (organizationList.length > 0 && !currentOrganization) {
      setCurrentOrganization(organizationList[0]);
    }
  }, [organizationList, currentOrganization, data, error]);

  const value = useMemo(() => {
    const regex = /\d+/g;
    const queryProduct = router.query?.product as string;
    const organizationIndex = regex.exec(queryProduct);

    if (currentOrganizations.length === 0 && organizationList.length > 0 && queryProduct && organizationIndex) {
      setCurrentOrganizations([organizationList[parseInt(organizationIndex[0], 10) - 1]]);
    }

    return {
      currentOrganization,
      currentOrganizations,
      setCurrentOrganizations,
      organizationList
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization, currentOrganizations, organizationList]);

  console.log('Dados da organização atualizada:', currentOrganizations);
  console.log('Lista de organizações atualizada:', organizationList);

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);

  if (context === undefined) {
    throw new Error('OrganizationContext must be used within a OrganizationProvider');
  }

  return context;
}
