(function () {
    const $ = document.querySelector.bind(document);

    const adminPostTable = {
        state: {
            posts: [],
        },
        init() {
            this.bindEvents();
        },

        bindEvents() {
            $('#btn-list-post').addEventListener('click', e => this.handleListPosts(e));
            $('#btn-add-post').addEventListener('click', e => this.ui.renderPostEditor());
            $('#content-area').addEventListener('click', e => {
                const editBtn = e.target.closest('button[data-action="edit"]');
                const deleteBtn = e.target.closest('button[data-action="delete"]');
                const createBtn = e.target.closest('button[data-action="create"]');
                const updateBtn = e.target.closest('button[data-action="update"]');
                const cancelBtn = e.target.closest('button[data-action="cancel"]');

                if (editBtn) this.handleEditPost(e);
                else if (deleteBtn) this.handleDeletePost(e);
                else if (createBtn) this.handleCreatePost(e);
                else if (updateBtn) this.handleUpdatePost(e);
                else if (cancelBtn) this.handleListPosts(e);
            });
        },
        async handleListPosts(e) {
            e.preventDefault();
            const loadingToast = Toast.loading('Đang tải danh sách bài viết...');
            try {
                const allPosts = await this.api.fetchPosts();
                this.state.posts = allPosts;
                this.ui.renderPostTable(this.state.posts);
            } catch (error) {
                console.error('Fetch posts error:', error);
                Toast.error('Không thể tải danh sách bài viết');
            } finally {
                Toast.dismiss(loadingToast);
            }
        },
        async handleCreatePost(e) {
            e.preventDefault();
            if (this.state.posts.length === 0) {
                this.state.posts = await this.api.fetchPosts();
            }
            if (confirm('Bạn có chắc muốn thêm bài viết này không?')) {
                const loadingToast = Toast.loading('Đang tạo bài viết...');
                try {
                    const title = $('#editor-post input[name="title"]').value.trim();
                    const content = $('#editor-post textarea[name="content"]').value.trim();
                    const imageFile = $('#editor-post input[name="image"]').files[0];

                    if (!title || !content) {
                        Toast.dismiss(loadingToast);
                        Toast.warning('Vui lòng điền đầy đủ tiêu đề và nội dung');
                        return;
                    }

                    const newPost = await this.api.createPost(title, content, imageFile);

                    Toast.dismiss(loadingToast);
                    Toast.success('Bài viết đã được thêm thành công');
                    this.state.posts.unshift(newPost);
                    this.ui.renderPostTable(this.state.posts);
                } catch (error) {
                    console.error('Create post error:', error);
                    Toast.dismiss(loadingToast);
                    Toast.error('Đã xảy ra lỗi: ' + error.message);
                }
            }
        },

        async handleEditPost(e) {
            const editBtn = e.target.closest('button[data-action="edit"]');
            if (!editBtn || !editBtn.closest('#table-post')) return;
            const id = editBtn.dataset.id;
            const title = this.state.posts.find(post => post.id == id).title;
            const content = this.state.posts.find(post => post.id == id).content;
            this.ui.renderPostEditor('update', id, title, content);
        },
        async handleUpdatePost(e) {
            e.preventDefault();
            const updateBtn = e.target.closest('button[data-action="update"]');
            const postId = updateBtn.dataset.id;
            if (confirm('Bạn có chắc muốn cập nhật bài viết này không?')) {
                const loadingToast = Toast.loading('Đang cập nhật bài viết...');
                try {
                    const title = $('#editor-post input[name="title"]').value.trim();
                    const content = $('#editor-post textarea[name="content"]').value.trim();
                    const imageFile = $('#editor-post input[name="image"]').files[0];

                    if (!title || !content) {
                        Toast.dismiss(loadingToast);
                        Toast.warning('Vui lòng điền đầy đủ tiêu đề và nội dung');
                        return;
                    }

                    await this.api.updatePost(postId, title, content, imageFile);
                    Toast.dismiss(loadingToast);
                    Toast.success('Bài viết đã được cập nhật thành công');

                    const postIndex = this.state.posts.findIndex(p => p.id == postId);
                    if (postIndex !== -1) {
                        this.state.posts[postIndex].title = title;
                        this.state.posts[postIndex].content = content;
                    }
                    this.ui.renderPostTable(this.state.posts);
                } catch (error) {
                    console.error('Update post error:', error);
                    Toast.dismiss(loadingToast);
                    Toast.error('Đã xảy ra lỗi: ' + error.message);
                }
            }
        },

        async handleDeletePost(e) {
            const deleteBtn = e.target.closest('button[data-action="delete"]');
            if (!deleteBtn || !deleteBtn.closest('#table-post')) return;

            const postId = deleteBtn.dataset.id;

            if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
                const loadingToast = Toast.loading('Đang xóa bài viết...');
                try {
                    await this.api.deletePost(postId);
                    Toast.dismiss(loadingToast);
                    Toast.success('Bài viết đã được xóa thành công');
                    this.state.posts = this.state.posts.filter(post => post.id != postId);
                    this.ui.renderPostTable(this.state.posts);
                } catch (error) {
                    console.error('Delete post error:', error);
                    Toast.dismiss(loadingToast);
                    Toast.error('Không thể xóa bài viết: ' + error.message);
                }
            }
        },

        api: {
            async fetchPosts() {
                return await fetchAPI.get('/admin/posts');
            },
            async createPost(title, content, imageFile) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                if (imageFile) {
                    formData.append('image', imageFile);
                }
                return await fetchAPI.postFormData('/admin/posts', formData);
            },
            async updatePost(postId, title, content, imageFile) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                if (imageFile) {
                    formData.append('image', imageFile);
                }
                return await fetchAPI.patchFormData(`/admin/posts/${postId}`, formData);
            },
            async deletePost(postId) {
                return await fetchAPI.delete(`/admin/posts/${postId}`);
            }
        },


        ui: {
            renderPostTable(posts) {
                $('#content-area').innerHTML = `
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Bảng Bài viết</h2>
                    </div>
                    <div id="table-post"></div>
                `;
                new gridjs.Grid({
                    columns: [
                        { name: 'ID', width: '0px', hidden: true },
                        {
                            name: 'Tiêu đề',
                            width: '200px',
                            formatter: (cell) => {
                                if (!cell) return "";
                                return cell.length > 60 ? cell.substring(0, 60) + "..." : cell;
                            }
                        },
                        {
                            name: 'Nội dung',
                            width: '300px',
                            formatter: (cell) => {
                                if (!cell) return "";
                                return cell.length > 100 ? cell.substring(0, 100) + "..." : cell;
                            }
                        },
                        { name: 'Ngày tạo', width: '100px' },
                        {
                            name: 'Hành động',
                            width: '60px',
                            formatter: (isOwner, row) => {
                                const id = row.cells[0].data;

                                if (isOwner) {
                                    return gridjs.html(`
                                        <div class="flex gap-3 justify-around">
                                            <button 
                                                class="text-blue-600 hover:text-blue-800" 
                                                data-id="${id}"     
                                                data-action="edit"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                class="text-red-600 hover:text-red-800" 
                                                data-id="${id}"
                                                data-action="delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    `);
                                } else {
                                    return gridjs.html(`
                                        <span class="text-gray-400 text-sm">
                                            Chỉ superadmin hoặc chủ sở hữu
                                        </span>`
                                    );
                                }
                            }
                        },
                    ],

                    data: posts.map(post => [
                        post.id,
                        post.title,
                        post.content,
                        new Date(post.createdAt * 1000).toLocaleDateString('vi-VN'),
                        post.isOwner
                    ]),

                    language: {
                        search: { placeholder: 'Tìm kiếm theo tiêu đề...' },
                    },
                    pagination: { enabled: true, limit: 10 },
                    search: true,
                    sort: true,
                }).render($("#table-post"));
            },
            renderPostEditor(type = 'create', id = '', title = '', content = '') {
                const action = type === 'create' ? 'create' : 'update';
                const buttonText = type === 'create' ? 'Đăng bài viết' : 'Cập nhật bài viết';

                $('#content-area').innerHTML = `   
                    <div id="editor-post" class="bg-white border-2 border-gray-600 w-full h-full flex flex-col">
                        <input name="title" value="${title}" class="sticky top-0 w-full outline-0 text-2xl font-semibold
                            p-4 border-b-2 border-black  z-10" placeholder="Tiêu đề" />
                        <textarea name="content" class="flex-1 overflow-y-auto p-6 outline-0">${content}</textarea>
                        <div class="ml-2">
                            
                            <label for="image" 
                                class="w-fit flex items-center justify-center px-4 py-3 bg-blue-600  border-2 border-gray-300 rounded-lg cursor-pointer">
                                <span class="text-sm font-medium text-white ">Chọn hình ảnh</span>
                            </label>
                            <input type="file" id="image" name="image" accept="image/*" 
                                class="hidden" 
                                onchange="this
                                    .previousElementSibling
                                    .querySelector('span')
                                    .textContent=this.files[0]?.name " 
                            />
                        </div>
                        <div class="flex justify-end">
                            <button data-action="${action}" data-id="${id}" class="bg-blue-600 w-fit p-2 m-2 rounded-md text-white">
                                ${buttonText}
                            </button>
                            <button data-action="cancel" class="bg-gray-600 w-fit p-2 m-2 rounded-md text-white">
                                Hủy
                            </button>
                        </div>
                    </div>`;
            }

        },

    }

    adminPostTable.init();

})();