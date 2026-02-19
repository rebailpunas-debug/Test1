import React, { useState, useEffect } from 'react';
import { Select, InlineField } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';

interface Dashboard {
  id: number;
  uid: string;
  title: string;
  tags: string[];
}

export const DashboardSelector: React.FC<StandardEditorProps<string>> = ({
  value,
  onChange,
  context,
}: StandardEditorProps<string>) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/search?query=&type=dash-db&limit=1000');
      if (response.ok) {
        const data = await response.json();
        setDashboards(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardOptions = dashboards.map((dashboard: Dashboard) => ({
    label: dashboard.title,
    value: dashboard.uid,
    description: dashboard.tags?.join(', '),
  }));

  const selectedOption = dashboardOptions.find((opt: any) => opt.value === value) || null;

  return (
    <InlineField label="Dashboard" labelWidth={12} grow>
      <Select
        options={dashboardOptions}
        value={selectedOption}
        onChange={(option: any) => {
          onChange(option?.value || '');
        }}
        placeholder="Select a dashboard"
        isLoading={isLoading}
        isClearable
        isSearchable
      />
    </InlineField>
  );
};
