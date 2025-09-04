import {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
	IAuthenticateGeneric,
} from 'n8n-workflow';

export class CompaniesHouseApi implements ICredentialType {
	name = 'companiesHouseApi';
	displayName = 'Companies House API';
	documentationUrl = 'https://developer.company-information.service.gov.uk/';
	icon = 'file:CompaniesHouse.svg' as const;

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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.apiKey}}',
				password: '',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.company-information.service.gov.uk',
			url: '/company/08338208', // Use Rixxo.com company number. Get in touch!
		},
	};
}

