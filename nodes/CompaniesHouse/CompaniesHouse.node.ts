import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
  NodeApiError,
} from 'n8n-workflow';

import { Buffer } from 'buffer';

export class CompaniesHouse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Companies House',
    name: 'companiesHouse',
    icon: 'file:companieshouse.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with the UK Companies House API to retrieve company information.',
    subtitle: '={{$parameter["operation"]}}',
    defaults: {
      name: 'Companies House',
    },
    inputs: ['main'],
    outputs: ['main'],
    // Removed the keywords/tags line entirely
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
        description: 'The type of operation to perform.',
        default: 'search',
        options: [
          {
            name: 'Get Company Profile',
            value: 'getProfile',
            description: 'Retrieve detailed profile information for a specific company.',
          },
          {
            name: 'Get Filing History',
            value: 'getFilingHistory',
            description: 'Fetch the company filing history including accounts and returns.',
          },
          {
            name: 'Get Officers',
            value: 'getOfficers',
            description: 'List the company directors and secretaries.',
          },
          {
            name: 'Get Persons with Significant Control',
            value: 'getPsc',
            description: 'List individuals or entities with significant control over the company.',
          },
          {
            name: 'Get Registered Office Address',
            value: 'getAddress',
            description: 'Retrieve the official registered office address of the company.',
          },
          {
            name: 'Search Companies',
            value: 'search',
            description: 'Search for companies by name.',
          },
        ],
      },
      {
        displayName: 'Company Name or Number',
        name: 'companyInput',
        type: 'string',
        default: '',
        required: true,
        description: 'Company name (for search) or registration number (for other operations).',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const companyInput = this.getNodeParameter('companyInput', i) as string;

      const credentials = await this.getCredentials('companiesHouseApi');
      const authHeader = 'Basic ' + Buffer.from(credentials.user + ':').toString('base64');

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
          break;
        case 'getFilingHistory':
          url = `https://api.company-information.service.gov.uk/company/${companyInput}/filing-history`;
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
        headers: {
          Authorization: authHeader,
        },
        json: true,
      };

      const response = await this.helpers.httpRequest.call(this, options);
      returnData.push({ json: response });
    }

    return [returnData];
  }
}
