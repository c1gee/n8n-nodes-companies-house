import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
  NodeApiError,
} from 'n8n-workflow';

export class CompaniesHouse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Companies House',
    name: 'companiesHouse',
    group: ['transform'],
    version: 1,
    description: 'Interact with the UK Companies House API',
    defaults: {
      name: 'Companies House',
    },
    inputs: ['main'],
    outputs: ['main'],
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
        options: [
          { name: 'Search Companies', value: 'search' },
          { name: 'Get Company Profile', value: 'getProfile' },
          { name: 'Get Officers', value: 'getOfficers' },
        ],
        default: 'search',
      },
      {
        displayName: 'Company Name or Number',
        name: 'companyInput',
        type: 'string',
        default: '',
        required: true,
        description: 'Company name (for search) or number (for profile/officers)',
        displayOptions: {
          show: {
            operation: ['search', 'getProfile', 'getOfficers'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const companyInput = this.getNodeParameter('companyInput', i) as string;

      let endpoint = '';

      switch (operation) {
        case 'search':
          endpoint = `/search/companies?q=${encodeURIComponent(companyInput)}`;
          break;
        case 'getProfile':
          endpoint = `/company/${encodeURIComponent(companyInput)}`;
          break;
        case 'getOfficers':
          endpoint = `/company/${encodeURIComponent(companyInput)}/officers`;
          break;
        default:
          throw new NodeApiError(this.getNode(), { message: `Unsupported operation: ${operation}` });
      }

      const credentials = await this.getCredentials('companiesHouseApi');
      const authHeader = 'Basic ' + Buffer.from(credentials.user + ':').toString('base64');

      const options: IHttpRequestOptions = {
        method: 'GET',
        url: `https://api.company-information.service.gov.uk${endpoint}`,
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
