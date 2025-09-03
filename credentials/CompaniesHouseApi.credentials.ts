import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CompaniesHouseApi implements ICredentialType {
	name = 'companiesHouseApi';
	displayName = 'Companies House API';
	documentationUrl = 'https://developer.company-information.service.gov.uk/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
		},
	];
}
