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
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong-regular-node
		outputs: [NodeConnectionType.Main],
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

			const responseData = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'companiesHouseApi',
				options,
			);

			returnData.push({
				json: responseData,
			});
		}

		return [returnData];
	}
}
