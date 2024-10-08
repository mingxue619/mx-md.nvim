local M = {}

function M.start()
	vim.g.mxmd_preview_bufnr = vim.api.nvim_get_current_buf()
	local servername = vim.v.servername
	-- lua print(servername)
	-- local pid = vim.fn.getpid()
	local script_path = debug.getinfo(1, "S").source:sub(2)
	-- local script_path = vim.fn.expand("<sfile>:p")
	local project_dir = script_path:match("(.*/).-/"):match("(.*/).-/")
	-- local cmd = "cd "
	-- 	.. project_dir
	-- 	.. " && ALLOW_CONSOLE=1  node server/server.js "
	-- 	.. servername
	-- 	.. " > ./mxmd.log"
	local cmd = "cd "
		.. project_dir
		.. " && ALLOW_CONSOLE=1  node --inspect server/server.js "
		.. servername
		.. " > ./mxmd.log"
	-- local cmd = "cd "
	-- 	.. project_dir
	-- 	.. " && ALLOW_CONSOLE=1  node --inspect-brk server/server.js "
	-- 	.. servername
	-- 	.. " > ./mxmd.log"
	-- print("cmd: " .. cmd)
	M.job_id = vim.fn.jobstart(cmd, {
		rpc = true,
		on_stdout = function(id, data, name)
			-- print("stdout: " .. table.concat(data, "\n"))
            vim.notify("stdout: " .. table.concat(data, "\n"), vim.log.levels.INFO)
		end,
		on_stderr = function(id, data, name)
			-- print("stderr: " .. table.concat(data, "\n"))
            vim.notify("stderr: " .. table.concat(data, "\n"), vim.log.levels.ERROR)
		end,
		on_exit = function(id, code, event)
			-- vim.g.mxmd_preview_bufnr = nil
			-- print("Node process exited with code " .. code)
            vim.notify("Node process exited with code " .. code, vim.log.levels.INFO)
		end,
	})
    return M.job_id;
end

function M.stop(job_id)
    if not job_id then
        job_id = M.job_id;
    end
    if not job_id then
        return
    end
    vim.fn.jobstop(job_id);
end
function M.restart() 
    M.stop();
    return M.start();
end

return M
