(function () { //IIFE
    const $ = document.querySelector.bind(document);

    const adminUserTable = {
        init() {
            this.bindEvents();
        },

        state: {
            users: [],

        },

        bindEvents() {
            $('#btn-list-admin').addEventListener('click', e => this.handleListUsers(e)); //show list admin users
            $('#content-area').addEventListener('click', e => this.handleDeleteUser(e)); // delete admin user
            $('#btn-add-admin').addEventListener('click', e => this.ui.showModal(e)); // show add admin modal
            $('#modal-form-admin').addEventListener('click', e => this.handleCreateUser(e)); // create admin user
        },

        api: {
            async fetchUsers() {
                return await fetchAPI.get('/admin/users');
            },
            async createUser(userData) {
                return await fetchAPI.post('/admin/users', userData);
            },
            async deleteUser(userId) {
                return await fetchAPI.delete(`/admin/users/${userId}`);

            }
        },

        ui: {
            showModal() {
                $('#modal-form-admin').classList.remove('hidden');
            },
            renderTable(users) {
                $('#content-area').innerHTML = `
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Bảng Admin</h2>
                    </div>
                    <div id="table-admin"></div>
                `;
                new gridjs.Grid({
                    columns: [
                        { name: 'ID', width: '0px', hidden: true },
                        { name: 'username', width: '80px' },
                        { name: 'email', width: '200px' },
                        { name: 'Vai trò', width: '100px' },
                        {
                            name: 'Hành động',
                            width: '60px',
                            formatter: (_, row) => {
                                const id = row.cells[0].data;
                                return gridjs.html(`
                                    <div class="flex gap-3 justify-around">
                                        <button class="text-red-600 hover:text-red-800" data-action="delete" data-id="${id} ">
                                            🗑️
                                        </button>
                                    </div>
                                `);
                            }
                        },
                    ],

                    data: users.map(user => [
                        user.id,
                        user.username,
                        user.email,
                        user.role
                    ]),
                    language: {
                        search: { placeholder: 'Tìm kiếm theo Username...' },
                    },
                    pagination: { enabled: true, limit: 10 },
                    search: true,
                    sort: true,
                }).render($("#table-admin"));
            },
        },

        async handleListUsers(e) {
            e.preventDefault();
            const loadingToast = Toast.loading('Đang tải danh sách admin...');
            try {
                const allUser = await this.api.fetchUsers();
                this.state.users = allUser
                this.ui.renderTable(this.state.users);
            } catch (error) {
                console.error('Fetch users error:', error);
                Toast.error('Không thể tải danh sách người dùng');
            } finally {
                Toast.dismiss(loadingToast);
            }
        },
        async handleDeleteUser(e) {
            const delBtn = e.target.closest('button[data-action="delete"]');
            if (!delBtn || !delBtn.closest('#table-admin')) return;

            const userId = delBtn.dataset.id;
            if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
                const loadingToast = Toast.loading('Đang xóa admin...');
                try {
                    await this.api.deleteUser(userId);
                    Toast.dismiss(loadingToast);
                    Toast.success('Người dùng đã được xóa thành công.');
                    this.state.users = this.state.users.filter(user => user.id != userId);
                    this.ui.renderTable(this.state.users);
                } catch (error) {
                    console.error('Delete user error:', error);
                    Toast.dismiss(loadingToast);
                    Toast.error('Không thể xóa người dùng: ' + error.message);
                }
            }
        },

        async handleCreateUser(e) {
            const modal = e.target.closest('[data-modal]');
            const createBtn = e.target.closest('button[data-action="create-admin"]'); //

            if (!modal || !createBtn) return;
            e.preventDefault();

            const usernameInput = modal.querySelector('input[name="username"]').value.trim();
            const emailInput = modal.querySelector('input[name="email"]').value.trim();

            const loadingToast = Toast.loading('Đang tạo admin...');
            try {
                const newUser = { username: usernameInput, email: emailInput, role: 'admin' };
                const response = await this.api.createUser(newUser);
                newUser.id = response.id;

                Toast.dismiss(loadingToast);
                Toast.success('Người dùng đã được thêm thành công.');
                modal.classList.add('hidden');

                this.state.users.push(newUser);
                this.ui.renderTable(this.state.users);
            }
            catch (error) {
                console.error('Create user error:', error);
                Toast.dismiss(loadingToast);
                Toast.error('Có lỗi xảy ra: ' + error.message);


            }
        }

    }

    adminUserTable.init();
})();

