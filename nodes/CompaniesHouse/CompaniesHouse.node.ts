import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

export class CompaniesHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Companies House',
		name: 'companiesHouse',
		group: ['transform'],
		version: 1,
		description: 'Search for UK company information via Companies House',
		defaults: {
			name: 'Companies House',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		outputs: ['main'],
		credentials: [
			{
				name: 'companiesHouseApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				default: '',
				placeholder: 'OpenAI Ltd',
				required: true,
				description: 'The name of the company to search for',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const companyName = this.getNodeParameter('companyName', i) as string;

			const options: IHttpRequestOptions = {
				method: 'GET' as IHttpRequestMethods,
				url: `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(companyName)}`,
				json: true,
			};

			const credentials = await this.getCredentials('companiesHouseApi');
const authHeader = 'Basic ' + Buffer.from(credentials.user + ':').toString('base64');

options.headers = {
	Authorization: authHeader,
};

const responseData = await this.helpers.httpRequest.call(this, options);


			returnData.push({
				json: responseData,
			});
		}

		return [returnData];
	}
}
