import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
  NodeApiError,
  NodeConnectionType,
} from 'n8n-workflow';

export class CompaniesHouse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Companies House',
    name: 'companiesHouse',
    icon: 'file:CompaniesHouse.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with the UK Companies House API to retrieve company information',
    subtitle: '={{$parameter["operation"]}}',
    defaults: {
      name: 'Companies House',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'companiesHouseApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        // Removed description here
        default: 'search',
        options: [
          {
            name: 'Get Company Profile',
            value: 'getProfile',
            action: 'Retrieve detailed profile information for a specific company',
            description: 'Retrieve detailed profile information for a specific company',
          },
          {
            name: 'Get Filing History',
            value: 'getFilingHistory',
            action: 'Fetch the company filing history including accounts and returns',
            description: 'Fetch the company filing history including accounts and returns',
          },
          {
            name: 'Get Officers',
            value: 'getOfficers',
            action: 'List the company directors and secretaries',
            description: 'List the company directors and secretaries',
          },
          {
            name: 'Get Persons with Significant Control',
            value: 'getPsc',
            action: 'List individuals or entities with significant control over the company',
            description: 'List individuals or entities with significant control over the company',
          },
          {
            name: 'Get Registered Office Address',
            value: 'getAddress',
            action: 'Retrieve the official registered office address of the company',
            description: 'Retrieve the official registered office address of the company',
          },
          {
            name: 'Search Companies',
            value: 'search',
            action: 'Search for companies by name',
            description: 'Search for companies by name',
          },
        ],
      },
      {
        displayName: 'Company Name or Number',
        name: 'companyInput',
        type: 'string',
        default: '',
        required: true,
        description: 'Company name (for search) or registration number (for other operations)',
      },
      {
        displayName: 'Filter Active Officers Only',
        name: 'activeOnly',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            operation: ['getOfficers'],
          },
        },
        description: 'Whether to only return currently active officers/directors',
      },
      {
        displayName: 'Filing Category (API Filter)',
        name: 'filingCategory',
        type: 'options',
        default: '',
        displayOptions: {
          show: {
            operation: ['getFilingHistory'],
          },
        },
        options: [
          {
            name: 'All Categories',
            value: '',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Confirmation Statement',
            value: 'confirmation-statement',
          },
          {
            name: 'Officers',
            value: 'officers',
          },
          {
            name: 'Address',
            value: 'address',
          },
          {
            name: 'Persons with Significant Control',
            value: 'persons-with-significant-control',
          },
          {
            name: 'Capital',
            value: 'capital',
          },
          {
            name: 'Resolution',
            value: 'resolution',
          },
          {
            name: 'Miscellaneous',
            value: 'miscellaneous',
          },
        ],
        description: '🚀 API-level filter: Reduces response size and improves speed by filtering server-side',
      },
      {
        displayName: 'Filing Type Code (Local Filter)',
        name: 'filingType',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['getFilingHistory'],
          },
        },
        description: '🔍 Local filter: Filters results after API response (e.g., CS01, AA, CH01)',
      },
      {
        displayName: 'Filing Description (Local Filter)',
        name: 'filingDescription',
        type: 'options',
        default: '',
        displayOptions: {
          show: {
            operation: ['getFilingHistory'],
          },
        },
        options: [
          {
            name: 'All Descriptions',
            value: '',
          },
          {
            name: '-- Accounts Descriptions --',
            value: '-',
          },
          {
            name: 'Accounts - Total Exemption Full',
            value: 'accounts-with-accounts-type-total-exemption-full',
          },
          {
            name: 'Accounts - Total Exemption Small',
            value: 'accounts-with-accounts-type-total-exemption-small',
          },
          {
            name: 'Accounts - Micro Entity',
            value: 'accounts-with-accounts-type-micro-entity',
          },
          {
            name: 'Accounts - Dormant',
            value: 'accounts-with-accounts-type-dormant',
          },
          {
            name: 'Accounts - Small',
            value: 'accounts-with-accounts-type-small',
          },
          {
            name: 'Accounts - Medium',
            value: 'accounts-with-accounts-type-medium',
          },
          {
            name: 'Accounts - Large',
            value: 'accounts-with-accounts-type-large',
          },
          {
            name: 'Confirmation Statement - With No Updates',
            value: 'confirmation-statement-with-no-updates',
          },
          {
            name: 'Confirmation Statement - With Updates',
            value: 'confirmation-statement-with-updates',
          },
          {
            name: 'Change Person Director',
            value: 'change-person-director-company-with-change-date',
          },
          {
            name: 'Appoint Person Director',
            value: 'appoint-person-director-company-with-date',
          },
          {
            name: 'Terminate Person Director',
            value: 'terminate-person-director-company-with-date',
          },
          {
            name: 'Change Person Secretary',
            value: 'change-person-secretary-company-with-change-date',
          },
          {
            name: 'Appoint Person Secretary',
            value: 'appoint-person-secretary-company-with-date',
          },
          {
            name: 'Terminate Person Secretary',
            value: 'terminate-person-secretary-company-with-date',
          },
          {
            name: 'Change Registered Office Address - Old & New',
            value: 'change-registered-office-address-company-with-date-old-address-new-address',
          },
          {
            name: 'Change Registered Office Address - New Address',
            value: 'change-registered-office-address-company-with-date-new-address',
          },
          {
            name: 'Change to a Person with Significant Control',
            value: 'change-to-a-person-with-significant-control',
          },
          {
            name: 'Appoint Person with Significant Control',
            value: 'appoint-person-with-significant-control',
          },
          {
            name: 'Terminate Person with Significant Control',
            value: 'terminate-person-with-significant-control',
          },
          {
            name: 'Allotment Shares',
            value: 'allotment-shares',
          },
          {
            name: 'Return of Allotment Shares',
            value: 'return-of-allotment-shares',
          },
          {
            name: 'Change Share Class Rights',
            value: 'change-share-class-rights',
          },
          {
            name: 'Resolution',
            value: 'resolution',
          },
          {
            name: 'Special Resolution',
            value: 'special-resolution',
          },
          {
            name: 'Change Company Name',
            value: 'change-company-name',
          },
          {
            name: 'Change Company Objects',
            value: 'change-company-objects',
          },
          {
            name: 'Change Company Status',
            value: 'change-company-status',
          },
        ],
        description: '🔍 Local filter: Filters results after API response by specific filing description',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i) as string;
        const companyInput = this.getNodeParameter('companyInput', i) as string;
        const activeOnly = this.getNodeParameter('activeOnly', i, false) as boolean;
        const filingType = this.getNodeParameter('filingType', i, '') as string;
        const filingCategory = this.getNodeParameter('filingCategory', i, '') as string;
        const filingDescription = this.getNodeParameter('filingDescription', i, '') as string;

        let url = '';
        switch (operation) {
          case 'search':
            url = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(companyInput)}`;
            break;
          case 'getProfile':
            url = `https://api.company-information.service.gov.uk/company/${companyInput}`;
            break;
          case 'getOfficers':
            url = `https://api.company-information.service.gov.uk/company/${companyInput}/officers`;
            if (activeOnly) {
              url += '?filter=active';
            }
            break;
          case 'getFilingHistory':
            url = `https://api.company-information.service.gov.uk/company/${companyInput}/filing-history`;
            // Only use category filter as it's supported by the API
            if (filingCategory) {
              url += `?category=${encodeURIComponent(filingCategory)}`;
            }
            break;
          case 'getAddress':
            url = `https://api.company-information.service.gov.uk/company/${companyInput}/registered-office-address`;
            break;
          case 'getPsc':
            url = `https://api.company-information.service.gov.uk/company/${companyInput}/persons-with-significant-control`;
            break;
          default:
            throw new NodeApiError(this.getNode(), { message: `Unknown operation: ${operation}` });
        }

        const options: IHttpRequestOptions = {
          method: 'GET',
          url,
          json: true,
        };

        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'companiesHouseApi', options);
      
      // Apply client-side filtering for filing history
      if (operation === 'getFilingHistory' && response.items) {
        let filteredItems = response.items;
        
        // Filter by type (client-side)
        if (filingType) {
          filteredItems = filteredItems.filter((item: any) => item.type === filingType);
        }
        
        // Filter by description (client-side)
        if (filingDescription) {
          filteredItems = filteredItems.filter((item: any) => item.description === filingDescription);
        }
        
        // Update response with filtered items
        response.items = filteredItems;
        response.total_count = filteredItems.length;
      }
      
      returnData.push({ json: response });
      
      } catch (error) {
        // Handle API errors gracefully and route to error output
        if (this.continueOnFail()) {
          const errorData = {
            json: {
              error: error.message,
              httpCode: error.httpCode,
              details: error.description || error.message,
              timestamp: new Date().toISOString(),
            },
            error: error,
          };
          returnData.push(errorData);
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}
