import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueBrowsilo from "@/components/VueBrowsilo.vue";

const localVue = createLocalVue()

describe("VueBrowsilo", () => {

    // Mount VueBrowsilo
    const wrapper = shallowMount(VueBrowsilo, {
        localVue,
    });

    test("Test the component.", async () => {

        expect(wrapper.vm.Title).toBe("")
        expect(wrapper.vm.ProjectTitle).toBe("")
        expect(wrapper.vm.ProjectPath).toStrictEqual([])
        expect(wrapper.vm.Inodes).toStrictEqual([])

        // The main title.
        await wrapper.setData({ Title: 'Test Title' })
        // The title of the project being browsed.
        await wrapper.setData({ ProjectTitle: 'TestProject v0.1' })
        // 'ProjectPath' is the project URL split in an indexed array.
        // When the 'ProjectPath' changes, the 'Inodes' object defined below is updated by a 'watcher'.
        await wrapper.setData({ ProjectPath: ["a"] })
        // The 'Inodes' is an array of objects. It must be updated with an API call.
        await wrapper.setData({ Inodes: [] })

        // Simulate an API call
        wrapper.vm.YOUR_SUPER_DUPER_API_CALL = (projectUrl = null) => {
            return new Promise((resolve) => {
                switch (projectUrl) {
                    case '/a':
                        return resolve([
                            {
                                fileType: 'dir',
                                fileContentType: '-',
                                fileSize: '-',
                                fileName: 'b'
                            }
                        ])
                    case '/a/b':
                        return resolve([
                            {
                                fileType: 'dir',
                                fileContentType: '-',
                                fileSize: '-',
                                fileName: 'test_empty_folder'
                            },
                            {
                                fileType: 'file',
                                fileContentType: 'text/plain',
                                fileSize: '7.0 Kb',
                                fileName: 'test_empty_file'
                            }
                        ])
                    default:
                        return resolve([])
                }
            })
        }

        await wrapper.vm.YOUR_SUPER_DUPER_API_CALL("/a").then((data) => {
            wrapper.vm.updateInodes(data)
        })

        await wrapper.vm.$nextTick(); // is required to take effect.

        expect(wrapper.vm.ProjectPath).toStrictEqual(["a"]);

        // Check view
        expect(wrapper.find("#browsilo-parent-button").text()).toBe('..')

        var children = await wrapper.findAll(".browsilo-inode-link");
        expect(children).toHaveLength(1);
        expect(children.at(0).find('.browsilo-inode-link').text()).toBe('b')


        // Enter folder "b"
        await children.at(0).find('a.browsilo-inode-link').trigger("click");
        await wrapper.vm.$nextTick();

        await wrapper.vm.YOUR_SUPER_DUPER_API_CALL("/a/b").then((data) => {
            wrapper.vm.updateInodes(data)
        })

        expect(wrapper.vm.ProjectPath).toStrictEqual(["a", "b"]);
        expect(wrapper.vm.Inodes).toStrictEqual([
            {
                fileType: 'dir',
                fileContentType: '-',
                fileSize: '-',
                fileName: 'test_empty_folder'
            },
            {
                fileType: 'file',
                fileContentType: 'text/plain',
                fileSize: '7.0 Kb',
                fileName: 'test_empty_file'
            }
        ])

        // Check view
        children = await wrapper.findAll(".browsilo-left-couple-column");
        expect(children).toHaveLength(6);

        expect(children.at(0).find('#browsilo-parent-button').text()).toBe('..')
        expect(children.at(2).find('.browsilo-inode-link').text()).toBe('test_empty_folder')
        expect(children.at(4).find('.browsilo-inode-link').text()).toBe('test_empty_file')

        // Enter test_empty_folder
        await children.at(2).find('.browsilo-inode-link').trigger("click")
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.ProjectPath).toStrictEqual(["a", "b", "test_empty_folder"]);
        children = await wrapper.findAll(".browsilo-left-couple-column");


        expect(wrapper.find("#browsilo-parent-button").text()).toBe('..')

        children = await wrapper.findAll(".browsilo-inode-link");
        expect(children).toHaveLength(0);
    });

    /**
     * Test without any code
     */
    test("Run the component as it is.", async () => {

        const localVue = createLocalVue()

        const freshWrapper = shallowMount(VueBrowsilo, {localVue});

        expect(freshWrapper.vm.Title).toBe("")
        expect(freshWrapper.vm.ProjectTitle).toBe("")
        expect(freshWrapper.vm.ProjectPath).toStrictEqual([])
        expect(freshWrapper.vm.Inodes).toStrictEqual([])

        // Check view
        expect(freshWrapper.find(".browsilo-box-titles").find('span').text()).toBe('0 files, 0 folders')
        expect(freshWrapper.find(".browsilo-page-title").find('h1').text()).toBe('')
        expect(freshWrapper.find(".browsilo-project-title").find('h2').text()).toBe('')

        // Clicks the ".." parent button
        freshWrapper.find("#browsilo-parent-button").trigger("click");
        await freshWrapper.vm.$nextTick()

        // Props should be unchanged
        expect(freshWrapper.vm.Title).toBe("")
        expect(freshWrapper.vm.ProjectTitle).toBe("")
        expect(freshWrapper.vm.ProjectPath).toStrictEqual([])
        expect(freshWrapper.vm.Inodes).toStrictEqual([])

        // View should be unchanged
        expect(freshWrapper.find(".browsilo-box-titles").find('span').text()).toBe('0 files, 0 folders')
    });

});
