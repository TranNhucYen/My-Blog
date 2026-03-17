const fetchAPI = {
    baseURL: '',

    async request(endpoint, options = {}) {
        let response;

        try {
            response = await fetch(this.baseURL + endpoint, options);
        } catch (networkError) {
            // Lỗi network (mất mạng, CORS, DNS...)
            const error = new Error('Network error');
            error.status = 0;
            throw error;
        }

        const text = await response.text();
        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch (parseError) {
            const error = new Error('Lỗi không xác định');
            error.status = response.status || 500;
            throw error;
        }

        if (!response.ok) {
            const error = new Error(data?.message || 'Request failed');
            error.status = response.status;
            throw error;
        }

        return data;
    },


    get(endpoint, options = {}) {
        return this.request(endpoint, options);
    },

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data)
        });
    },

    postFormData(endpoint, formData, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: formData
        });
    },

    patchFormData(endpoint, formData, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: formData
        });
    },

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers // override headers if provided
            },
            body: JSON.stringify(data)
        });
    },

    patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers // override headers if provided
            },
            body: JSON.stringify(data)
        });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE'
        });
    }
};